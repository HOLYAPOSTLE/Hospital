import React, { useState, useId } from 'react';
import { FlaskConical, Check, ThumbsUp, Upload, FileText } from 'lucide-react';
import { Visit } from '../types';

interface LabReportUploadProps {
  visits: Visit[];
  onUploadResult: (visitId: number, requestId: number, resultText: string, fileName?: string) => void;
}

export function LabReportUpload({ visits, onUploadResult }: LabReportUploadProps) {
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
  const [resultTexts, setResultTexts] = useState<Record<number, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<number, string>>({});
  const [validationError, setValidationError] = useState('');

  const selectedVisit = visits.find(v => v.id === selectedVisitId);

  const fileInputId = useId();

  const handleSelectVisit = (visitId: number) => {
    setSelectedVisitId(visitId);
    setValidationError('');
    setResultTexts({});
    setSelectedFiles({});
  };

  const handleTextChange = (requestId: number, val: string) => {
    setResultTexts({
      ...resultTexts,
      [requestId]: val
    });
  };

  const handleRealFileUpload = (requestId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFiles(prev => ({
        ...prev,
        [requestId]: file.name
      }));
    }
  };

  const handleFakeFileUpload = (requestId: number) => {
    // Simulate uploading a laboratory report PDF
    const mockFileNames = [
      'complete_blood_count_result.pdf',
      'glucose_screening_charts.pdf',
      'lipid_profile_breakdowns.pdf',
      'renal_test_log.pdf'
    ];
    const chosenFile = mockFileNames[Math.floor(Math.random() * mockFileNames.length)];
    setSelectedFiles({
      ...selectedFiles,
      [requestId]: chosenFile
    });
  };

  const handleSaveResult = (requestId: number) => {
    const textVal = resultTexts[requestId] || 'Normal levels';
    const fileVal = selectedFiles[requestId] || 'report_summary.pdf';
    
    onUploadResult(selectedVisitId!, requestId, textVal, fileVal);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Laboratory Inbox</h3>
            <p className="text-slate-400 text-xs text-[11px]">Diagnostic queues needing result parameters</p>
          </div>
        </div>

        <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
          {visits.length === 0 ? (
            <div className="text-center py-12">
              <ThumbsUp className="w-12 h-12 text-blue-200 mx-auto mb-3" />
              <p className="text-slate-400 text-xs">All diagnostic tests are caught up!</p>
            </div>
          ) : (
            visits.map((visit) => {
              const pendingCount = visit.labRequests.filter(req => req.status === 'Pending').length;
              return (
                <button
                  key={visit.id}
                  onClick={() => handleSelectVisit(visit.id)}
                  className={`w-full text-left p-3.5 rounded-sm border transition-all flex justify-between items-center cursor-pointer ${
                    selectedVisitId === visit.id
                      ? 'border-blue-500 bg-blue-50/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{visit.patient?.name}</h4>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-sm border border-slate-200/50 text-slate-500">{visit.patient?.op_number}</span>
                      <span>Tests: {visit.labRequests.length} total</span>
                    </div>
                  </div>
                  <span className="text-[9px] bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                    {pendingCount} Pending
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-sm border border-slate-200 shadow-sm p-6">
        {selectedVisit ? (
          <div>
            <div className="border-b border-slate-200 pb-4 mb-4">
              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-sm uppercase tracking-wider mb-1 inline-block">Diagnostic Desk</span>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{selectedVisit.patient?.name}</h3>
              <p className="text-slate-400 text-xs mt-0.5">Vitals Logged &middot; OP: {selectedVisit.patient?.op_number} &middot; Doctor Assigned ID: {selectedVisit.doctor_id}</p>
            </div>

            {validationError && (
              <div className="p-3 mb-4 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-sm">
                ⚠️ {validationError}
              </div>
            )}

            <div className="space-y-4">
              {selectedVisit.labRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-sm border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 font-mono">LAB TEST CODE: {req.id}094</span>
                    <h4 className="text-xs font-bold text-slate-800">{req.test_name}</h4>
                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider border ${
                      req.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  {req.status === 'Pending' ? (
                    <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center flex-1 max-w-lg justify-end">
                      <input
                        type="text"
                        placeholder="Key raw values / assessment results..."
                        value={resultTexts[req.id] || ''}
                        onChange={(e) => handleTextChange(req.id, e.target.value)}
                        className="flex-1 min-w-[140px] px-3 py-1.5 text-xs border border-slate-200 rounded-sm bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium"
                      />

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <label className="px-2.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-sm hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-all font-semibold hover:border-blue-300">
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-[10px] max-w-[120px] truncate">
                            {selectedFiles[req.id] ? selectedFiles[req.id] : 'Choose file...'}
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleRealFileUpload(req.id, e)}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => handleFakeFileUpload(req.id)}
                          className="px-2 py-1.5 text-[9px] text-slate-450 bg-slate-50 border border-slate-200 rounded-sm hover:bg-slate-100 transition-all font-bold uppercase tracking-wide cursor-pointer"
                          title="Generate a realistic sample test file automatically"
                        >
                          Auto PDF
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveResult(req.id)}
                          className="px-3.5 py-1.5 text-xs text-white bg-blue-600 rounded-sm hover:bg-blue-700 font-bold cursor-pointer transition-all uppercase tracking-wide bg-blue-600"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-3 rounded-sm border border-slate-200 max-w-md text-xs">
                      <p className="font-bold text-slate-700">Result Parameters:</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{req.result_text}</p>
                      {req.report_file && (
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-blue-600 font-mono font-bold">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{req.report_file}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-sm border border-dashed border-slate-200">
            <FlaskConical className="w-16 h-16 text-slate-350 stroke-1 mb-4 animate-pulse" />
            <h4 className="font-bold text-slate-600 text-sm uppercase tracking-wider">Lab System Offline</h4>
            <p className="text-slate-400 text-xs text-center mt-1 max-w-sm leading-normal">Open patient results records by clicking any clinical card in the left diagnostics inbox column.</p>
          </div>
        )}
      </div>
    </div>
  );
}
