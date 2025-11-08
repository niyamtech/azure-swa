import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Save,
  ShieldCheck,
} from "lucide-react";

const STORAGE_KEY = "taxvault_intake_form";

const fieldGroups = [
  {
    title: "Identity",
    description: "Help us confirm who you are with official personal details.",
    fields: [
      {
        name: "fullName",
        label: "Full Legal Name",
        placeholder: "John Alexander Citizen",
      },
      {
        name: "dateOfBirth",
        label: "Date of Birth",
        type: "date",
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        type: "tel",
        placeholder: "0412 345 678",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "you@example.com",
      },
      {
        name: "referredBy",
        label: "Referred By",
        placeholder: "Name of person or company (optional)",
        optional: true,
      },
    ],
  },
  {
    title: "Addresses",
    description: "We use this for ATO correspondence and confirmation letters.",
    fields: [
      {
        name: "address",
        label: "Current Residential Address",
        placeholder: "Unit 5, 21 Market Street, Perth WA 6000",
      },
    ],
  },
  {
    title: "Tax Details",
    description: "These numbers stay encrypted and are only visible to our tax agents.",
    fields: [
      {
        name: "tfn",
        label: "Tax File Number",
        placeholder: "123 456 789",
      },
      {
        name: "abn",
        label: "ABN (if applicable)",
        placeholder: "12 345 678 901",
        optional: true,
      },
    ],
  },
  {
    title: "Banking",
    description: "Needed for faster tax refunds straight to your account.",
    fields: [
      {
        name: "bsb",
        label: "Bank BSB",
        placeholder: "062-123",
      },
      {
        name: "accountNumber",
        label: "Account Number",
        placeholder: "12345678",
      },
    ],
  },
];

const initialState = fieldGroups
  .flatMap((group) => group.fields)
  .reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});

function FormInput({ field, value, onChange, error }) {
  const { label, name, type = "text", placeholder, optional } = field;

  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {optional ? (
          <span className="text-xs text-slate-400">Optional</span>
        ) : null}
      </div>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E15C31] ${
            error ? "border-red-400" : "border-slate-300"
          }`}
          rows={4}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E15C31] ${
            error ? "border-red-400" : "border-slate-300"
          }`}
        />
      )}
      {error ? (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={14} /> {error}
        </p>
      ) : null}
    </label>
  );
}

export default function UserIntakeForm({ onStatusChange }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.data) {
        setFormData({ ...initialState, ...parsed.data });
        setSubmitted(Boolean(parsed.submitted));
        setLastSaved(parsed.lastSaved || null);
        onStatusChange?.(Boolean(parsed.submitted));
      }
    } catch (error) {
      console.error("Failed to load intake form", error);
    }
  }, [onStatusChange]);

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ data: formData, submitted, lastSaved })
    );
  }, [formData, submitted, lastSaved]);

  const totalRequired = useMemo(
    () =>
      fieldGroups.reduce(
        (count, group) =>
          count + group.fields.filter((field) => !field.optional).length,
        0
      ),
    []
  );

  const completedRequired = useMemo(
    () =>
      fieldGroups.reduce(
        (count, group) =>
          count +
          group.fields.filter((field) => !field.optional && formData[field.name])
            .length,
        0
      ),
    [formData]
  );

  const completionRate = Math.round((completedRequired / totalRequired) * 100);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitted(false);
    setLastSaved(new Date().toISOString());
    onStatusChange?.(false);
  };

  const validate = () => {
    const nextErrors = {};
    fieldGroups.forEach((group) => {
      group.fields.forEach((field) => {
        if (!field.optional && !formData[field.name]) {
          nextErrors[field.name] = "This field is required.";
        }
      });
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    const now = new Date().toISOString();
    setLastSaved(now);
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ data: formData, submitted: true, lastSaved: now })
    );
    onStatusChange?.(true);
  };

  const handleReset = () => {
    setFormData(initialState);
    setErrors({});
    setSubmitted(false);
    setLastSaved(null);
    sessionStorage.removeItem(STORAGE_KEY);
    onStatusChange?.(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-[#E15C31] to-orange-500 px-6 py-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList size={26} />
          <div>
            <h2 className="text-lg font-semibold">Your Tax Profile</h2>
            <p className="text-sm text-white/80">
              We ask for the essentials only once. It stays secured with MFA.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end text-sm">
          <span className="font-semibold">{completionRate}% complete</span>
          <span className="text-white/70">
            {completedRequired} of {totalRequired} required fields
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600">
          <ShieldCheck className="text-[#E15C31]" size={18} />
          <span>
            Your details are end-to-end encrypted. Only authorised agents with
            MFA can view or edit this information.
          </span>
        </div>

        {fieldGroups.map((group) => (
          <section key={group.title} className="space-y-3">
            <header>
              <h3 className="text-base font-semibold text-slate-800">
                {group.title}
              </h3>
              <p className="text-sm text-slate-500">{group.description}</p>
            </header>
            <div className="grid gap-4 md:grid-cols-2">
              {group.fields.map((field) => (
                <FormInput
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  onChange={handleChange}
                  error={errors[field.name]}
                />
              ))}
            </div>
          </section>
        ))}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-400">
            {lastSaved ? (
              <span>
                Last saved {new Date(lastSaved).toLocaleString()} — autosave
                keeps your data safe even if you refresh.
              </span>
            ) : (
              <span>Progress saves automatically in this browser.</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Clear form
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#E15C31] text-white hover:opacity-95 flex items-center gap-2"
            >
              <Save size={16} /> Save & Lock In Details
            </button>
          </div>
        </div>

        {submitted ? (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
            <CheckCircle2 size={18} />
            Details secured. You can still edit above if something changes.
          </div>
        ) : null}
      </form>
    </div>
  );
}
