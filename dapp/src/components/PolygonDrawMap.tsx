import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { GeoJsonPolygon } from '../types/traceability';
import { Navigation, RotateCcw, Trash2 } from 'lucide-react';

interface Props {
  initialPolygon?: GeoJsonPolygon;
  onPolygonChange: (geoJson: GeoJsonPolygon, areaHectares: number) => void;
  height?: string;
  isSeniorMode?: boolean;
}

export const PolygonDrawMap: React.FC<Props> = ({ onPolygonChange, height = '340px', isSeniorMode = true }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Points array: [[lat, lng], ...]
  const [points, setPoints] = useState<[number, number][]>([
    [19.8921, 102.1342],
    [19.8935, 102.1388],
    [19.8895, 102.1402],
    [19.8878, 102.1351]
  ]);

  // Rough area calculation in hectares for demonstration
  const calculateAreaHectares = (pts: [number, number][]): number => {
    if (pts.length < 3) return 0;
    let area = 0;
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += pts[i][1] * pts[j][0];
      area -= pts[j][1] * pts[i][0];
    }
    const sqMeters = Math.abs(area) * 0.5 * 111319.9 * 111319.9 * Math.cos(pts[0][0] * Math.PI / 180);
    return Number((sqMeters / 10000).toFixed(2));
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [19.891, 102.136],
        zoom: 16,
        attributionControl: false
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapRef.current = map;

      // Click to add point
      map.on('click', (e: L.LeafletMouseEvent) => {
        setPoints(prev => [...prev, [e.latlng.lat, e.latlng.lng]]);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update polygon visuals when points change
  useEffect(() => {
    if (!layerGroupRef.current || !mapRef.current) return;

    layerGroupRef.current.clearLayers();

    // Add marker pins for each vertex
    points.forEach((p, idx) => {
      const pin = L.circleMarker(p, {
        radius: isSeniorMode ? 9 : 6,
        fillColor: '#34d399',
        color: '#064e3b',
        weight: 3,
        fillOpacity: 1
      });
      pin.bindTooltip(`ຈຸດທີ ${idx + 1}`, { permanent: false });
      layerGroupRef.current?.addLayer(pin);
    });

    if (points.length >= 3) {
      const poly = L.polygon(points, {
        color: '#10b981',
        weight: 3,
        fillColor: '#10b981',
        fillOpacity: 0.35
      });
      layerGroupRef.current.addLayer(poly);

      const hectares = calculateAreaHectares(points);
      
      // Emit GeoJSON [lng, lat]
      const closedCoords = [...points.map(([lat, lng]) => [lng, lat]), [points[0][1], points[0][0]]];
      const geoJson: GeoJsonPolygon = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [closedCoords]
          },
          properties: {
            areaHectares: hectares
          }
        }]
      };

      onPolygonChange(geoJson, hectares);
    }
  }, [points, isSeniorMode]);

  const handleClear = () => {
    setPoints([]);
  };

  const handleResetSample = () => {
    setPoints([
      [19.8921, 102.1342],
      [19.8935, 102.1388],
      [19.8895, 102.1402],
      [19.8878, 102.1351]
    ]);
  };

  const handleAutoGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 17);
          }
          const delta = 0.0015;
          setPoints([
            [lat + delta, lng - delta],
            [lat + delta, lng + delta],
            [lat - delta, lng + delta],
            [lat - delta, lng - delta]
          ]);
        },
        () => {
          // Fallback location Luang Prabang plot
          handleResetSample();
        }
      );
    } else {
      handleResetSample();
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height,
      borderRadius: '8px',
      overflow: 'hidden',
      border: '2px solid #cdd8c4',
      boxShadow: '0 4px 14px rgba(21, 56, 38, 0.08)'
    }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Top Map Action Buttons (Large Touch Targets for Seniors) */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 1000,
        gap: '8px'
      }}>
        {/* Giant Auto-GPS button */}
        <button
          type="button"
          onClick={handleAutoGPS}
          style={{
            flex: 1,
            padding: isSeniorMode ? '10px 14px' : '8px 12px',
            fontSize: isSeniorMode ? '13px' : '11px',
            fontWeight: 800,
            background: '#153826',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 3px 10px rgba(0,0,0,0.3)'
          }}
        >
          <Navigation size={isSeniorMode ? 18 : 14} />
          <span>📍 ປັກໝຸດບ່ອນຢືນ (GPS 1 ບາດກົດ)</span>
        </button>

        <button
          type="button"
          onClick={handleResetSample}
          style={{
            padding: isSeniorMode ? '10px 12px' : '8px 10px',
            fontSize: isSeniorMode ? '13px' : '11px',
            fontWeight: 800,
            background: '#ffffff',
            color: '#153826',
            border: '1.5px solid #153826',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <RotateCcw size={14} />
          <span>ຣີເຊັດ</span>
        </button>

        <button
          type="button"
          onClick={handleClear}
          style={{
            padding: isSeniorMode ? '10px 12px' : '8px 10px',
            fontSize: isSeniorMode ? '13px' : '11px',
            fontWeight: 800,
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1.5px solid #f87171',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Trash2 size={14} />
          <span>ລຶບ</span>
        </button>
      </div>

      {/* Bottom Area Calculation Badge */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '10px',
        right: '10px',
        background: '#ffffff',
        border: '1.5px solid #cdd8c4',
        padding: isSeniorMode ? '10px 16px' : '6px 14px',
        borderRadius: '6px',
        fontSize: isSeniorMode ? '14px' : '11.5px',
        fontWeight: 800,
        color: '#142a1d',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>📍 ປັກແລ້ວ: <strong style={{ color: '#153826' }}>{points.length} ຈຸດ</strong></span>
        <span>ເນື້ອທີ່: <strong style={{ color: '#153826', fontSize: isSeniorMode ? '16px' : '13px' }}>{calculateAreaHectares(points)} ເຮັກຕາ</strong></span>
      </div>
    </div>
  );
};
