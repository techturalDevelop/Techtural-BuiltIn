import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { findKitHomeModel } from '@/data/kitHomesData';
import { updateSocialMetaTags } from '@/lib/seoMeta';

export default function ShareRedirectPage() {
  const { modelParam } = useParams<{ modelParam: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const model = findKitHomeModel(modelParam);
    if (model) {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const thumb = origin ? `${origin}/share-thumbnails/model-${model.officialNumber}.jpg` : model.image;
      updateSocialMetaTags({
        title: `Techtural Kit Home — ${model.name} (${model.code})`,
        description: `${model.name} (${model.code}) | ${model.bedrooms} Bed, ${model.bathrooms} Bath, ${model.buildingAreaSqm} m². Engineered for Papua New Guinea.`,
        imageUrl: thumb,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        imageAlt: `${model.name} 3D Artist Impression Perspective`,
      });
      navigate(`/kit-homes?model=${encodeURIComponent(model.id)}`, { replace: true });
    } else {
      navigate('/kit-homes', { replace: true });
    }
  }, [modelParam, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
      <div className="animate-pulse text-sm font-semibold text-amber-400">Loading Kit Home Model Specifications...</div>
    </div>
  );
}
