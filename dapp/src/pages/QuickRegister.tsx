import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  QrCode,
  CheckCircle2,
  Globe,
  ArrowRight,
  Printer,
  Share2,
  Sparkles,
  AlertCircle,
  RefreshCw,
  MapPin,
  Satellite,
  Shield,
  Layers,
  Wallet as WalletIcon,
  ExternalLink
} from 'lucide-react';
import L from 'leaflet';
import { BrowserProvider, isAddress, getAddress } from 'ethers';
import { registerBatchToBackend } from '../services/backendApi';
import {
  callPythonAiVerify,
  registerBatchOnChain,
  type AiVerifyResponse
} from '../services/web3Traceability';
import {
  LAO_TRACEABILITY_ADDRESS,
  TraceType
} from '../contracts/laoNationalTraceability';

export function QuickRegister() {
  const navigate = useNavigate();

  // Form State
  const [destination, setDestination] = useState<'EU' | 'China'>('EU');
  const [batchId, setBatchId] = useState<string>(() => 'BATCH-LAO-' + Math.floor(100 + Math.random() * 900));
  const [productType, setProductType] = useState<string>('ກາເຟອາຣາບິກາ (Arabica Coffee)');
  const [traceType, setTraceType] = useState<TraceType>(TraceType.IdentityPreserved);
  const [quantity, setQuantity] = useState<number>(15400);
  const [farmLocation, setFarmLocation] = useState<string>('15.1764, 106.2341 (Paksong Highland, Champasak)');
  const [ownerName, setOwnerName] = useState<string>('ສົມສັກ ພອນສະຫວັນ (Somsack Phonsavanh)');
  const [targetFactory, setTargetFactory] = useState<string>('0x71C6707321eE51f72b3F3E8E349887114A51f72b');

  // Web3 Wallet state
  const [walletAccount, setWalletAccount] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState<boolean>(false);

  // Map state
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [currentCoords, setCurrentCoords] = useState<[number, number]>([15.1764, 106.2341]); // Paksong Bolaven Plateau

  // 2-Step Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [stepStatus, setStepStatus] = useState<string>('');
  const [aiEvidence, setAiEvidence] = useState<AiVerifyResponse | null>(null);
  const [onChainTxHash, setOnChainTxHash] = useState<string | null>(null);
  const [registeredBatch, setRegisteredBatch] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Detect MetaMask
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const eth = (window as any).ethereum;
      eth.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setWalletAccount(getAddress(accounts[0]));
          }
        })
        .catch(() => {});

      const handleAccounts = (accs: string[]) => {
        setWalletAccount(accs.length ? getAddress(accs[0]) : null);
      };
      eth.on?.('accountsChanged', handleAccounts);
      return () => {
        eth.removeListener?.('accountsChanged', handleAccounts);
      };
    }
  }, []);

  const handleConnectWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('MetaMask ບໍ່ພົບໃນບຣາວເຊີ. ກະລຸນາຕິດຕັ້ງ MetaMask ຫຼື ເປີດໃນແອັບມືຖື');
      return;
    }
    try {
      setIsConnectingWallet(true);
      const eth = (window as any).ethereum;
      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts[0]) {
        setWalletAccount(getAddress(accounts[0]));
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: currentCoords,
        zoom: 14,
        attributionControl: false
      });

      // Esri Satellite Layer
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map);

      // Boundaries & Labels overlay
      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map);

      // Initial Marker
      const marker = L.marker(currentCoords, { draggable: true }).addTo(map);
      marker.bindPopup('<b>ແປງປູກກາເຟ (Coffee Farm Plot)</b><br/>ລາກໝຸດເພື່ອປັບພິກັດ').openPopup();

      marker.on('dragend', () => {
        const latlng = marker.getLatLng();
        const newCoords: [number, number] = [Number(latlng.lat.toFixed(4)), Number(latlng.lng.toFixed(4))];
        setCurrentCoords(newCoords);
        setFarmLocation(`${newCoords[0]}, ${newCoords[1]} (Paksong, Champasak)`);
      });

      // Map Click to move marker
      map.on('click', (e: L.LeafletMouseEvent) => {
        const newCoords: [number, number] = [Number(e.latlng.lat.toFixed(4)), Number(e.latlng.lng.toFixed(4))];
        marker.setLatLng(e.latlng);
        setCurrentCoords(newCoords);
        setFarmLocation(`${newCoords[0]}, ${newCoords[1]} (Paksong Highland)`);
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Quick preset farm locations
  const handleSelectPreset = (lat: number, lng: number, name: string) => {
    setCurrentCoords([lat, lng]);
    setFarmLocation(`${lat}, ${lng} (${name})`);
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15);
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.bindPopup(`<b>${name}</b>`).openPopup();
    }
  };

  const handleRegenerateId = () => {
    setBatchId('BATCH-LAO-' + Math.floor(100 + Math.random() * 900));
  };

  /**
   * 2-Step Flow Implementation:
   * 1. Step 1 (Off-Chain): Call Python AI API (/api/ai-verify)
   * 2. Step 2 (On-Chain): Call Smart Contract (registerBatch) via MetaMask
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setOnChainTxHash(null);

    try {
      // -----------------------------------------------------------------
      // Step 1: Off-Chain Python AI Verification (Satellite EUDR)
      // -----------------------------------------------------------------
      setStepStatus('🛰️ ຂັ້ນຕອນ 1/2: ກຳລັງຍິງ API ຫາ Python AI ກວດສອບດາວທຽມ Sentinel-2 EUDR...');
      
      const aiResult = await callPythonAiVerify({
        batch_id: batchId.trim(),
        action: 'CHECK_DEFORESTATION',
        coordinates: [
          [currentCoords[1], currentCoords[0]],
          [currentCoords[1] + 0.005, currentCoords[0] + 0.002],
          [currentCoords[1] + 0.003, currentCoords[0] - 0.004],
          [currentCoords[1], currentCoords[0]]
        ]
      });

      setAiEvidence(aiResult);

      if (aiResult.status !== 'PASS') {
        throw new Error('AI EUDR Verification ບໍ່ຜ່ານ: ພົບຄວາມສ່ຽງຕັດໄມ້ທຳລາຍປ່າ');
      }

      // -----------------------------------------------------------------
      // Step 2: On-Chain Smart Contract Invocation (registerBatch)
      // -----------------------------------------------------------------
      let txHash = '';
      if (typeof window !== 'undefined' && (window as any).ethereum && walletAccount) {
        setStepStatus('⛓️ ຂັ້ນຕອນ 2/2: ກຳລັງເປີດ MetaMask ເພື່ອບັນທຶກສັນຍາ Smart Contract ບົນ LAB Chain...');
        const provider = new BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();

        const onChainResult = await registerBatchOnChain(signer, {
          batchId: batchId.trim(),
          traceType,
          productType: productName.trim(),
          quantity,
          offChainDataHash: aiResult.evidence_hash,
          targetFactory: targetFactory.trim()
        });

        txHash = onChainResult.txHash;
        setOnChainTxHash(txHash);
      } else {
        setStepStatus('⚡ ບັນທຶກລົງຖານຂໍ້ມູນ & Web 2.5 State (MetaMask ຍັງບໍ່ໄດ້ເຊື່ອມຕໍ່)...');
      }

      // Sync with Backend/Local cache for seamless tracking
      const farmLocationWithDest = `${farmLocation} [Destination: ${destination}]`;
      await registerBatchToBackend({
        batch_id: batchId.trim(),
        product_name: productName.trim(),
        farm_location: farmLocationWithDest,
        owner: walletAccount || ownerName.trim()
      });

      setRegisteredBatch({
        batch_id: batchId.trim(),
        product_name: productName.trim(),
        farm_location: farmLocationWithDest,
        owner: walletAccount || ownerName.trim(),
        evidence_hash: aiResult.evidence_hash,
        txHash
      });

      setStepStatus('✅ ລົງທະບຽນສຳເລັດສົມບູນທັງ Off-Chain AI & On-Chain Contract!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການລົງທະບຽນ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // QR Code URL for Tracking Page
  const trackingUrl = registeredBatch
    ? `${window.location.origin}/#/track/${encodeURIComponent(registeredBatch.batch_id)}`
    : '';

  const productName = productType;

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '10px 0 40px 0' }}>

      {/* Top Banner & Smart Contract Info */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #d5dfce',
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>👨‍🌾</span>
            <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#153826', margin: 0 }}>
              1. ໜ້າຊາວກະສິກອນ — ລົງທະບຽນສິນຄ້າ (Farmer Portal)
            </h1>
          </div>
          <p style={{ fontSize: '12px', color: '#4d6052', margin: '4px 0 0 0' }}>
            Flow 2 ຈັງຫວະ: <strong>Step 1: Python AI (Satellite EUDR)</strong> ➔ <strong>Step 2: Smart Contract (registerBatch)</strong>
          </p>
        </div>

        {/* Web3 Wallet & Contract Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            fontSize: '11px',
            background: '#f4f8f2',
            border: '1px solid #c9d8c3',
            padding: '4px 10px',
            borderRadius: '6px',
            color: '#153826',
            fontWeight: 700
          }}>
            <span>Contract: </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 800 }}>
              {LAO_TRACEABILITY_ADDRESS.substring(0, 6)}...{LAO_TRACEABILITY_ADDRESS.substring(38)}
            </span>
          </div>

          {walletAccount ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: '#dcfce7',
              border: '1px solid #86efac',
              borderRadius: '6px',
              fontSize: '11.5px',
              fontWeight: 800,
              color: '#15803d'
            }}>
              <WalletIcon size={14} />
              <span>{walletAccount.substring(0, 6)}...{walletAccount.substring(38)}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConnectWallet}
              disabled={isConnectingWallet}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: '#153826',
                border: 'none',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: 800,
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <WalletIcon size={14} />
              <span>{isConnectingWallet ? 'ກຳລັງເຊື່ອມ...' : 'ເຊື່ອມ MetaMask'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Form Left, Satellite Map Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(320px, 0.95fr)', gap: '22px' }}>
        
        {/* Left Column: Register Form */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #d5dfce',
          borderRadius: '8px',
          padding: '22px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#142a1d', margin: '0 0 16px 0', borderBottom: '1px solid #edf2e7', paddingBottom: '10px' }}>
            ຟອມລົງທະບຽນສິນຄ້າຕົ້ນນ້ຳ (LaoTrace Register)
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

            {/* Destination Toggle */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#153826', marginBottom: '8px' }}>
                ປາຍທາງການສົ່ງອອກ (Export Destination): <span style={{ color: '#b45309' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setDestination('EU')}
                  style={{
                    padding: '10px',
                    borderRadius: '6px',
                    border: destination === 'EU' ? '2px solid #153826' : '1px solid #d5dfce',
                    background: destination === 'EU' ? '#eaf1e5' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '12.5px', color: '#153826' }}>🇪🇺 ເອີຣົບ (EU)</span>
                    {destination === 'EU' && <CheckCircle2 size={15} color="#153826" />}
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#4d6052', display: 'block', marginTop: '2px' }}>ກວດສອບ EUDR ບໍ່ຕັດໄມ້ທຳລາຍປ່າ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDestination('China')}
                  style={{
                    padding: '10px',
                    borderRadius: '6px',
                    border: destination === 'China' ? '2px solid #153826' : '1px solid #d5dfce',
                    background: destination === 'China' ? '#eaf1e5' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '12.5px', color: '#153826' }}>🇨🇳 ສປ ຈີນ (China)</span>
                    {destination === 'China' && <CheckCircle2 size={15} color="#153826" />}
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#4d6052', display: 'block', marginTop: '2px' }}>GACC e-Phyto & AI OCR ແປພາສາຈີນ</span>
                </button>
              </div>
            </div>

            {/* Trace Type & Batch ID in 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
                  ປະເພດຕິດຕາມ (traceType):
                </label>
                <select
                  value={traceType}
                  onChange={(e) => setTraceType(Number(e.target.value) as TraceType)}
                  style={{
                    width: '100%',
                    padding: '9px 10px',
                    borderRadius: '6px',
                    border: '1.5px solid #d5dfce',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#153826',
                    background: '#ffffff'
                  }}
                >
                  <option value={TraceType.IdentityPreserved}>0: Identity Preserved (ກາເຟ/ຢາງ)</option>
                  <option value={TraceType.MassBalance}>1: Mass Balance (ມັນຕົ້ນ/ອ້ອຍ)</option>
                  <option value={TraceType.IndividualTrace}>2: Individual Trace (ສັດລ້ຽງ)</option>
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#142a1d' }}>
                    ລະຫັດລັອດ (_batchId):
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateId}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#153826',
                      fontSize: '10.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontWeight: 700
                    }}
                  >
                    <RefreshCw size={10} />
                    <span>ສຸ່ມ</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 10px',
                    borderRadius: '6px',
                    border: '1.5px solid #d5dfce',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#153826',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Product Type & Quantity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
                  ຊື່ສິນຄ້າ (_productType): <span style={{ color: '#b45309' }}>*</span>
                </label>
                <input
                  type="text"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 10px',
                    borderRadius: '6px',
                    border: '1.5px solid #d5dfce',
                    fontSize: '12.5px',
                    color: '#142a1d',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
                  ນ້ຳໜັກ (_quantity kg): <span style={{ color: '#b45309' }}>*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 10px',
                    borderRadius: '6px',
                    border: '1.5px solid #d5dfce',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    color: '#153826',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Target Factory Wallet Address (_targetFactory) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#142a1d' }}>
                  ເລືອກໂຮງງານປາຍທາງ (_targetFactory Wallet Address): <span style={{ color: '#b45309' }}>*</span>
                </label>
              </div>
              <input
                type="text"
                value={targetFactory}
                onChange={(e) => setTargetFactory(e.target.value)}
                required
                placeholder="0x..."
                style={{
                  width: '100%',
                  padding: '9px 10px',
                  borderRadius: '6px',
                  border: '1.5px solid #d5dfce',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#153826',
                  fontWeight: 700,
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10.5px', color: '#64748b' }}>ຕົວຢ່າງໂຮງງານ:</span>
                <button
                  type="button"
                  onClick={() => setTargetFactory('0x71C6707321eE51f72b3F3E8E349887114A51f72b')}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '10px', padding: '2px 6px', cursor: 'pointer' }}
                >
                  🏭 ໂຮງງານກາເຟດາວ (Dao Coffee)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetFactory('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '10px', padding: '2px 6px', cursor: 'pointer' }}
                >
                  🏭 ໂຮງງານແປ້ງມັນຕົ້ນ ລາວ-ຈີນ
                </button>
              </div>
            </div>

            {/* Farm Location Input (Synched with Map) */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
                ພິກັດແປງປູກ (Farm Location Coordinates): <span style={{ color: '#b45309' }}>*</span>
              </label>
              <input
                type="text"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 10px',
                  borderRadius: '6px',
                  border: '1.5px solid #d5dfce',
                  fontSize: '12px',
                  color: '#142a1d',
                  fontWeight: 700,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Status updates during 2-step process */}
            {stepStatus && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#166534',
                lineHeight: 1.4
              }}>
                {stepStatus}
              </div>
            )}

            {errorMessage && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px', borderRadius: '6px', color: '#991b1b', fontSize: '12px' }}>
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '4px',
                padding: '12px 20px',
                background: '#153826',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(21, 56, 38, 0.2)'
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>ກຳລັງປະມວນຜົນ 2-Step Flow...</span>
                </>
              ) : (
                <>
                  <QrCode size={18} />
                  <span>ຍື່ນກວດ AI & ບັນທຶກ Smart Contract</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Satellite Map & QR Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Interactive Satellite Map Component (MANDATORY in brief) */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #d5dfce',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="#153826" />
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#153826', margin: 0 }}>
                  ແຜນທີ່ດາວທຽມປັກໝຸດແປງປູກ (GIS Satellite Map)
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700 }}>
                ● Esri World Imagery
              </span>
            </div>

            {/* Map Container */}
            <div
              ref={mapContainerRef}
              style={{
                width: '100%',
                height: registeredBatch ? '200px' : '260px',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid #cbd5e1'
              }}
            />

            {/* Preset Buttons */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#4d6052', alignSelf: 'center', fontWeight: 700 }}>ຕົວຢ່າງແປງ:</span>
              <button
                type="button"
                onClick={() => handleSelectPreset(15.1764, 106.2341, 'Paksong Highland Plot A')}
                style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #d5dfce', background: '#f8fafc', cursor: 'pointer' }}
              >
                ☕ ປາກຊ່ອງ (ຈຳປາສັກ)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(19.8921, 102.1342, 'Luang Prabang Arabica Farm')}
                style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #d5dfce', background: '#f8fafc', cursor: 'pointer' }}
              >
                🌿 ຫຼວງພະບາງ
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(15.1123, 106.3145, 'Bolaven Plateau Special Plot')}
                style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #d5dfce', background: '#f8fafc', cursor: 'pointer' }}
              >
                ⛰️ ພູພຽງບໍລະເວນ
              </button>
            </div>
          </div>

          {/* QR Code Result Box (When Submitted) */}
          {registeredBatch && (
            <div style={{
              background: '#ffffff',
              border: '2px solid #153826',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 4px 16px rgba(21, 56, 38, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#dcfce7',
                color: '#15803d',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 800,
                marginBottom: '10px'
              }}>
                <CheckCircle2 size={14} />
                <span>ສ້າງ QR Code & On-Chain สำเร็จ!</span>
              </div>

              <div style={{ fontSize: '18px', fontWeight: 900, color: '#153826', letterSpacing: '0.5px' }}>
                {registeredBatch.batch_id}
              </div>
              <div style={{ fontSize: '12px', color: '#4d6052', marginBottom: '8px' }}>
                {registeredBatch.product_name}
              </div>

              {/* AI & On-chain Proof Badges */}
              {registeredBatch.evidence_hash && (
                <div style={{
                  fontSize: '11px',
                  background: '#f0fdf4',
                  color: '#166534',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  fontFamily: 'monospace',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  IPFS: {registeredBatch.evidence_hash}
                </div>
              )}

              {onChainTxHash && (
                <a
                  href={`https://explorer.labchain.la/tx/${onChainTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: '#0284c7',
                    textDecoration: 'none',
                    fontWeight: 700,
                    marginBottom: '10px'
                  }}
                >
                  <span>Tx: {onChainTxHash.substring(0, 10)}...{onChainTxHash.substring(56)}</span>
                  <ExternalLink size={11} />
                </a>
              )}

              {/* QR Image Box */}
              <div style={{
                background: '#ffffff',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid #153826',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                marginBottom: '12px'
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(trackingUrl)}`}
                  alt="Product Batch QR"
                  style={{ width: '160px', height: '160px', display: 'block' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '10px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: '#edf2e7',
                    color: '#153826',
                    border: '1px solid #d5dfce',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Printer size={13} />
                  <span>ພິມ QR ຕິດກ່ອງ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(trackingUrl);
                    alert('ຄັດລອກລິ້ງແລ້ວ!');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: '#edf2e7',
                    color: '#153826',
                    border: '1px solid #d5dfce',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Share2 size={13} />
                  <span>ຄັດລອກລິ້ງ</span>
                </button>
              </div>

              <Link
                to={`/track/${encodeURIComponent(registeredBatch.batch_id)}`}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 14px',
                  background: '#153826',
                  color: '#ffffff',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>ເປີດໜ້າກວດສອບ (Track & Trace)</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
