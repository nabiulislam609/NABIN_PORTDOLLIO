import React from 'react';
import { X, Mail, Trash2, Calendar, User, CheckCircle2 } from 'lucide-react';
import { ContactMessage } from '../types.ts';

interface InquiriesModalProps {
  isOpen: boolean;
  messages: ContactMessage[];
  onClose: () => void;
  onDeleteMessage: (id: string) => void;
}

export const InquiriesModal: React.FC<InquiriesModalProps> = ({
  isOpen,
  messages,
  onClose,
  onDeleteMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiries-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0A0E1A] border border-[#3A4A63] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#F2F5FA]">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-xl text-[#AAB8CE] hover:text-white hover:bg-[#1A2438] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 id="inquiries-modal-title" className="text-xl font-bold text-white">
              Client Inquiries & Messages ({messages.length})
            </h3>
            <p className="text-xs text-[#AAB8CE]">
              Submissions received through the contact form, securely saved in persistent storage.
            </p>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="py-16 text-center text-[#AAB8CE]">
            <CheckCircle2 className="w-12 h-12 text-[#3A4A63] mx-auto mb-3" />
            <p className="text-sm">No incoming inquiries at this time.</p>
            <p className="text-xs text-[#B8C6DC]/60 mt-1">
              New inquiries submitted via the Contact form will be listed here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl bg-[#1A2438]/70 border border-[#232E45] flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{msg.name}</span>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-cyan-300 hover:underline"
                      >
                        ({msg.email})
                      </a>
                    </div>
                    <div className="text-xs font-semibold text-[#B8C6DC] mt-0.5">
                      Subject: {msg.subject}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#AAB8CE] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#F2F5FA] bg-[#0A0E1A]/60 p-3 rounded-lg border border-[#232E45]/80 whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="pt-6 mt-6 border-t border-[#232E45] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1A2438] hover:bg-[#232E45] text-xs font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
