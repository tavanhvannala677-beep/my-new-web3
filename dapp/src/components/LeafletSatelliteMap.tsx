import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { GeoJsonPolygon } from '../types/traceability';

interface Props {
  geoJson: GeoJsonPolygon;
  height?: string;
  zoom?: number;
}

export const LeafletSatelliteMap: React.FC<Props> = ({ geoJson, height = '360px', zoom = 15 }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // First coordinate pair to center map
    const coords = geoJson.features[0]?.geometry?.coordinates[0] || [];
    const centerPoint = coords.length > 0 
      ? [coords[0][1], coords[0][0]] as [number, number] // [lat, lng]
      : [19.8921, 102.1342] as [number, number]; // default Luang Prabang

    // Cleanup previous map if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Map
    const map = L.map(mapContainerRef.current, {
      center: centerPoint,
      zoom: zoom,
      zoomControl: true,
      attributionControl: false
    });
    mapInstanceRef.current = map;

    // High Resolution Satellite Imagery (Esri World Imagery)
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Esri, Maxar, Earthstar Geographics'
      }
    );
    satelliteLayer.addTo(map);

    // Add Label overlay (roads and places)
    L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19 }
    ).addTo(map);

    // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
    const latLngs = coords.map(([lng, lat]) => [lat, lng] as [number, number]);

    if (latLngs.length > 0) {
      // Draw Polygon
      const polygon = L.polygon(latLngs, {
        color: '#10b981', // Emerald green
        weight: 3,
        opacity: 0.9,
        fillColor: '#10b981',
        fillOpacity: 0.25,
        dashArray: '4, 4'
      }).addTo(map);

      // Fit bounds to polygon
      map.fitBounds(polygon.getBounds(), { padding: [40, 40] });

      // Custom HTML Marker / Badge
      const customIcon = L.divIcon({
        className: 'custom-eudr-pin',
        html: `
          <div style="background: #ffffff; border: 1.5px solid #153826; color: #153826; padding: 4px 12px; border-radius: 16px; font-size: 11px; font-weight: 800; white-space: nowrap; box-shadow: 0 2px 8px rgba(21,56,38,0.2); display: flex; align-items: center; gap: 4px;">
            <span style="color: #153826;">●</span> EUDR Verified Plot
          </div>
        `,
        iconSize: [140, 30],
        iconAnchor: [70, 15]
      });

      L.marker(polygon.getBounds().getCenter(), { icon: customIcon }).addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [geoJson, zoom]);

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '10px', overflow: 'hidden', border: '1px solid #cdd8c4' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: '#ffffff',
        border: '1px solid #cdd8c4',
        padding: '5px 12px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 700,
        color: '#153826',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        zIndex: 1000
      }}>
        🛰️ Sentinel-2 / Esri Satellite · Verified Cutoff 31 Dec 2020
      </div>
    </div>
  );
};
