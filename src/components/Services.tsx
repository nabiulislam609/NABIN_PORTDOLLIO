import React, { useState } from 'react';
import {
  Megaphone,
  Search,
  MapPin,
  Navigation,
  Share2,
  Users,
  Target,
  BarChart3,
  Code,
  FileText,
  ExternalLink,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { SERVICES_DATA } from '../data/defaultData.ts';
import { ServiceItem } from '../types.ts';
import { ServiceDetailModal } from './ServiceDetailModal.tsx';

interface ServicesProps {
  onSelectServiceForInquiry: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectServiceForInquiry }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Icon mapping
  const renderIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6 transition-transform group-hover:scale-110 duration-200' };
    switch (iconName) {
      case 'Megaphone':
        return <Megaphone {...props} className="w-6 h-6 text-indigo-400 group-hover:scale-110" />;
      case 'Search':
        return <Search {...props} className="w-6 h-6 text-cyan-400 group-hover:scale-110" />;
      case 'MapPin':
        return <MapPin {...props} className="w-6 h-6 text-emerald-400 group-hover:scale-110" />;
      case 'Navigation':
        return <Navigation {...props} className="w-6 h-6 text-teal-400 group-hover:scale-110" />;
      case 'Share2':
        return <Share2 {...props} className="w-6 h-6 text-blue-400 group-hover:scale-110" />;
      case 'Users':
        return <Users {...props} className="w-6 h-6 text-purple-400 group-hover:scale-110" />;
      case 'Target':
        return <Target {...props} className="w-6 h-6 text-rose-400 group-hover:scale-110" />;
      case 'BarChart3':
        return <BarChart3 {...props} className="w-6 h-6 text-amber-400 group-hover:scale-110" />;
      case 'Code':
        return <Code {...props} className="w-6 h-6 text-sky-400 group-hover:scale-110" />;
      case 'FileText':
        return <FileText {...props} className="w-6 h-6 text-emerald-300 group-hover:scale-110" />;
      case 'ExternalLink':
        return <ExternalLink {...props} className="w-6 h-6 text-violet-400 group-hover:scale-110" />;
      default:
        return <Layers {...props} className="w-6 h-6 text-cyan-400 group-hover:scale-110" />;
    }
  };

  return (
    <section id="services" className="py-24 relative z-10 border-t border-[#232E45]/60 bg-[#0A0E1A]/40 content-auto-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2438] border border-[#232E45] text-xs font-semibold text-[#B8C6DC] uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Digital Marketing Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F2F5FA] tracking-tight">
            High-Impact Growth & Optimization Capabilities
          </h2>
          <p className="mt-3 text-base text-[#AAB8CE] max-w-2xl">
            Specialized solutions designed to increase high-intent inbound inquiries, dominate search rankings, and maximize return on advertising spend.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-[#3A4A63] rounded-full mt-4"></div>
        </div>

        {/* Responsive Grid: 1 col mobile, 2 col tablet, 3-4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SERVICES_DATA.map((service, index) => (
            <div
              key={service.id}
              className="group relative rounded-2xl bg-[#1A2438]/50 hover:bg-[#1A2438]/90 border border-[#232E45] hover:border-[#3A4A63] p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
              id={`service-card-${index}`}
            >
              {/* Card top: Icon & Category badge */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#232E45]/60 border border-[#3A4A63]/50 flex items-center justify-center p-2.5">
                    {renderIcon(service.iconName)}
                  </div>
                  <span className="text-[11px] font-semibold text-[#B8C6DC] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0A0E1A]/60 border border-[#232E45]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#F2F5FA] mb-2.5 group-hover:text-white transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#AAB8CE] leading-relaxed mb-6 line-clamp-3">
                  {service.shortDescription}
                </p>
              </div>

              {/* Card Bottom: View Details action */}
              <div className="pt-4 border-t border-[#232E45]/70 flex items-center justify-between">
                <span className="text-[11px] text-[#AAB8CE] font-medium">
                  {service.deliverables.length} Key Deliverables
                </span>

                <button
                  onClick={() => setSelectedService(service)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/btn"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onInquire={(title) => onSelectServiceForInquiry(title)}
      />
    </section>
  );
};
