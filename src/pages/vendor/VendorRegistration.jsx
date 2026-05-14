import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Check, UploadCloud, ArrowRight, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

export default function VendorRegistration() {
  const navigate = useNavigate();
  const { vendors, setVendors } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    industry: '',
    address: '',
    contactName: '',
    email: '',
    phone: '',
    designation: '',
    bankAccountName: '',
    bankAccountNumber: '',
    ifscCode: '',
    documents: []
  });

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.companyName) newErrors.companyName = "Company name is required";
      if (!formData.registrationNumber) newErrors.registrationNumber = "Registration number is required";
      if (!formData.industry) newErrors.industry = "Industry is required";
      if (!formData.address) newErrors.address = "Address is required";
    }
    if (step === 2) {
      if (!formData.contactName) newErrors.contactName = "Contact name is required";
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.designation) newErrors.designation = "Designation is required";
    }
    if (step === 3) {
      if (!formData.bankAccountName) newErrors.bankAccountName = "Account name is required";
      if (!formData.bankAccountNumber) newErrors.bankAccountNumber = "Account number is required";
      if (!formData.ifscCode) newErrors.ifscCode = "IFSC code is required";
      if (formData.documents.length === 0) newErrors.documents = "At least one document is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(s => Math.min(3, s + 1));
  };

  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    let validFiles = [];
    let fileErrors = [];

    files.forEach(file => {
      const isTypeValid = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
      const isSizeValid = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isTypeValid) fileErrors.push(`${file.name} has invalid format.`);
      else if (!isSizeValid) fileErrors.push(`${file.name} exceeds 5MB limit.`);
      else validFiles.push({ name: file.name, type: file.type, size: file.size });
    });

    if (fileErrors.length > 0) {
      setErrors({ ...errors, documents: fileErrors.join(' ') });
    } else {
      setFormData({ ...formData, documents: [...formData.documents, ...validFiles] });
      setErrors({ ...errors, documents: null });
    }
  };

  const removeDocument = (index) => {
    const newDocs = formData.documents.filter((_, i) => i !== index);
    setFormData({ ...formData, documents: newDocs });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      const newVendor = {
        id: `V00${vendors.length + 1}`,
        ...formData,
        status: 'Pending',
        rating: 0, onTimeDelivery: 0, invoiceAccuracy: 0, responseTime: 0,
        submittedDate: new Date().toISOString().split('T')[0]
      };
      setVendors([...vendors, newVendor]);
      // Save temp registration ID to check status
      localStorage.setItem('registrationId', newVendor.id);
      navigate('/vendor/status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Vendor Registration</h2>
          <p className="mt-4 text-lg text-slate-500">Partner with us by completing this 3-step application.</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-10">
          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-200">
              <div style={{ width: `${(step / 3) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"></div>
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <div className={clsx("w-1/3 text-left", step >= 1 ? "text-indigo-600" : "")}>Company Details</div>
              <div className={clsx("w-1/3 text-center", step >= 2 ? "text-indigo-600" : "")}>Contact Person</div>
              <div className={clsx("w-1/3 text-right", step >= 3 ? "text-indigo-600" : "")}>Bank & Documents</div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 p-6 sm:p-10">
          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Step 1: Company Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={clsx("w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors", errors.companyName ? "border-red-300" : "border-slate-300")} />
                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Registration/Tax Number *</label>
                    <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className={clsx("w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors", errors.registrationNumber ? "border-red-300" : "border-slate-300")} />
                    {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Industry *</label>
                    <select name="industry" value={formData.industry} onChange={handleChange} className={clsx("w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors bg-white", errors.industry ? "border-red-300" : "border-slate-300")}>
                      <option value="">Select Industry</option>
                      <option value="IT Hardware">IT Hardware</option>
                      <option value="Software">Software</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Stationery">Stationery</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Complete Address *</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className={clsx("w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors", errors.address ? "border-red-300" : "border-slate-300")} />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Step 2: Primary Contact</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} className={clsx("w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors", errors.contactName ? "border-red-300" : "border-slate-300")} />
                    {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Designation *</label>
                    <input type="text" name="designation" value={formData.designation} onChange={handleChange} className={clsx("w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors", errors.designation ? "border-red-300" : "border-slate-300")} />
                    {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={clsx("w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors", errors.email ? "border-red-300" : "border-slate-300")} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={clsx("w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors", errors.phone ? "border-red-300" : "border-slate-300")} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Step 3: Bank & Documents</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Bank Details</h4>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account Name *</label>
                    <input type="text" name="bankAccountName" value={formData.bankAccountName} onChange={handleChange} className={clsx("w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors", errors.bankAccountName ? "border-red-300" : "border-slate-300")} />
                    {errors.bankAccountName && <p className="text-red-500 text-xs mt-1">{errors.bankAccountName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account Number *</label>
                    <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} className={clsx("w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors", errors.bankAccountNumber ? "border-red-300" : "border-slate-300")} />
                    {errors.bankAccountNumber && <p className="text-red-500 text-xs mt-1">{errors.bankAccountNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">IFSC / Routing Code *</label>
                    <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className={clsx("w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors", errors.ifscCode ? "border-red-300" : "border-slate-300")} />
                    {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>}
                  </div>

                  <div className="md:col-span-2 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Verification Documents</h4>
                    <p className="text-xs text-slate-500 mb-4">Upload GST Certificate, PAN Card, and Cancelled Cheque/Bank Statement. (PDF/JPG/PNG, Max 5MB)</p>
                    
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative cursor-pointer group">
                      <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <UploadCloud className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      <p className="mt-2 text-sm text-slate-600 font-medium">Drag & drop files here, or click to browse</p>
                    </div>
                    {errors.documents && <p className="text-red-500 text-xs mt-2">{errors.documents}</p>}

                    {formData.documents.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {formData.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-center justify-between py-2 px-4 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="text-sm text-slate-700 truncate font-medium">{doc.name}</span>
                            <button type="button" onClick={() => removeDocument(idx)} className="text-red-500 text-sm hover:text-red-700 font-medium">Remove</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={step === 1 ? () => navigate('/login') : prevStep}
                className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {step === 1 ? 'Back to Login' : 'Previous Step'}
              </button>
              
              <button
                type="submit"
                className="flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-all shadow-sm shadow-indigo-200"
              >
                {step === 3 ? (
                  <>Submit Application <Check className="w-4 h-4 ml-2" /></>
                ) : (
                  <>Next Step <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}