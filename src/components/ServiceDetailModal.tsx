import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, Wrench, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../types.ts';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onInquire: (serviceTitle: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onInquire,
}) => {
  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [service]);

  if (!service) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0A0E1A] border border-[#3A4A63] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#F2F5FA]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-xl text-[#AAB8CE] hover:text-white hover:bg-[#1A2438] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#1A2438] border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Service Scope & Deliverables
            </span>
            <h3 id="service-modal-title" className="text-2xl font-bold text-[#F2F5FA]">
              {service.title}
            </h3>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#AAB8CE] leading-relaxed mb-6">
          {service.fullDescription}
        </p>

        {/* Key Deliverables List */}
        <div className="mb-6 p-4 rounded-xl bg-[#1A2438]/60 border border-[#232E45]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8C6DC] mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            What is Included
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#F2F5FA]">
            {service.deliverables.map((d, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tools & Outcomes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-3.5 rounded-xl bg-[#1A2438]/40 border border-[#232E45]">
            <span className="text-xs font-semibold text-[#AAB8CE] flex items-center gap-1.5 mb-2">
              <Wrench className="w-3.5 h-3.5 text-indigo-400" />
              Platforms & Tools
            </span>
            <div className="flex flex-wrap gap-1.5">
              {service.tools.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-[#232E45]/80 text-[#B8C6DC] text-[11px] font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1A2438]/40 border border-[#232E45]">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Target Outcome
            </span>
            <p className="text-xs text-[#F2F5FA] leading-relaxed">
              {service.typicalOutcomes}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#232E45]">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-[#AAB8CE] hover:text-white bg-[#1A2438] hover:bg-[#232E45] transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onInquire(service.title);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>Inquire for {service.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
