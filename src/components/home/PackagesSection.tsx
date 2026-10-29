import React from 'react';
import { Package } from '../../types';
import { Check, Sparkles, Tag, ArrowRight } from 'lucide-react';

interface PackagesSectionProps {
  packages: Package[];
  onEnquirePackage: (pkg: Package) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  onEnquirePackage,
}) => {
  const publishedPackages = packages.filter((p) => p.isPublished);

  return (
    <section className="py-24 bg-[#08080C] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel mb-2">
            <Tag className="w-3.5 h-3.5" />
            <span>Curated Engagements</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl text-white font-bold tracking-tight">
            Exclusive Packages & <span className="text-gold-gradient">Service Tiers</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-3 leading-relaxed">
            Standardized production packages and bespoke talent agreements designed for enterprise campaigns, luxury weddings, fashion weeks, and headline concerts.
          </p>
        </div>

        {publishedPackages.length === 0 ? (
          <div className="card-luxury rounded-2xl p-12 text-center max-w-xl mx-auto border-gold-subtle">
            <Sparkles className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-3" />
            <h3 className="font-cinzel text-base font-bold text-white mb-2">
              No Packages Published Yet
            </h3>
            <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed">
              Pricing tiers and fixed deliverables are maintained by the executive booking desk. Custom quotation requests can still be submitted directly through our general booking form.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`card-luxury rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  pkg.isFeatured ? 'border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.15)] bg-[#121218]' : 'border-gold-subtle'
                }`}
              >
                {pkg.isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#D4AF37] text-black font-cinzel text-[10px] font-black uppercase tracking-wider shadow">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="text-xs font-cinzel text-[#D4AF37] uppercase font-bold tracking-wider mb-2">
                    {pkg.categoryName || pkg.categorySlug}
                  </div>
                  <h3 className="font-cinzel text-xl font-bold text-white mb-3">
                    {pkg.title}
                  </h3>

                  {/* Price display */}
                  <div className="my-4 pb-4 border-b border-white/10">
                    <span className="text-2xl sm:text-3xl font-cinzel font-black text-gold-gradient">
                      {pkg.priceType === 'fixed' ? pkg.price : 'Custom Quote'}
                    </span>
                    {pkg.duration && (
                      <span className="text-xs text-gray-400 block mt-1">
                        Timeline: {pkg.duration}
                      </span>
                    )}
                  </div>

                  {/* Deliverables List */}
                  <div className="space-y-2.5 my-6 text-xs text-gray-300">
                    <p className="font-cinzel text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                      Included Deliverables:
                    </p>
                    {pkg.deliverables && pkg.deliverables.map((d, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>

                  {pkg.exclusions && (
                    <p className="text-[11px] text-gray-500 italic border-t border-white/5 pt-3 mb-6">
                      * Exclusions: {pkg.exclusions}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onEnquirePackage(pkg)}
                  className={`w-full py-3 rounded-lg text-xs font-bold tracking-wider uppercase transition flex items-center justify-center gap-2 ${
                    pkg.isFeatured ? 'btn-gold' : 'btn-burgundy'
                  }`}
                >
                  <span>{pkg.priceType === 'fixed' ? 'Book Package' : 'Request Quotation'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
