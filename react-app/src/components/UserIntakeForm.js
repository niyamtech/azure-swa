import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Loader2,
  MapPin,
  Save,
  ShieldCheck,
} from "lucide-react";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { fetchAddressSuggestions } from "../services/addressLookup";
import {
  formatAbn,
  formatTfn,
  isValidAbn,
  isValidTfn,
} from "../utils/validateio";

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
        placeholder: "Start typing to search Australian addresses",
        type: "address",
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

function FormInput({ field, value, onChange, error, render }) {
  const { label, name, type = "text", placeholder, optional } = field;

  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {optional ? (
          <span className="text-xs text-slate-400">Optional</span>
        ) : null}
      </div>
      {render ? (
        render({ value, onChange, placeholder, error })
      ) : type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] ${
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
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] ${
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
  const [addressQuery, setAddressQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const debouncedAddress = useDebouncedValue(addressQuery, 400);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.data) {
        setFormData({ ...initialState, ...parsed.data });
        setAddressQuery(parsed.data?.address || "");
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
    let nextValue = value;

    if (name === "tfn") {
      nextValue = formatTfn(value);
    }

    if (name === "abn") {
      nextValue = formatAbn(value);
    }

    if (name === "address") {
      setAddressQuery(nextValue);
    }

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitted(false);
    setLastSaved(new Date().toISOString());
    onStatusChange?.(false);
  };

  useEffect(() => {
    let isMounted = true;

    if (!debouncedAddress || debouncedAddress.trim().length < 4) {
      setAddressSuggestions([]);
      setAddressLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setAddressLoading(true);
    fetchAddressSuggestions(debouncedAddress).then((results) => {
      if (!isMounted) return;
      setAddressSuggestions(results);
      setAddressLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [debouncedAddress]);

  const validate = () => {
    const nextErrors = {};
    fieldGroups.forEach((group) => {
      group.fields.forEach((field) => {
        if (!field.optional && !formData[field.name]) {
          nextErrors[field.name] = "This field is required.";
        }

        if (field.name === "tfn" && formData[field.name] && !isValidTfn(formData[field.name])) {
          nextErrors[field.name] = "Enter a valid 8 or 9 digit TFN.";
        }

        if (field.name === "abn" && formData[field.name] && !isValidAbn(formData[field.name])) {
          nextErrors[field.name] = "That ABN doesn’t pass the official checksum.";
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
    setAddressQuery("");
    setAddressSuggestions([]);
    setAddressLoading(false);
    sessionStorage.removeItem(STORAGE_KEY);
    onStatusChange?.(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-xl overflow-hidden">
      <div className="bg-gradient-to-r from-[#0C6CF2] to-[#5C9CFF] px-6 py-5 text-white flex items-center justify-between">
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
          <ShieldCheck className="text-brand-primary" size={18} />
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
                  render={
                    field.type === "address"
                      ? ({ value, onChange: onValueChange, placeholder, error: fieldError }) => (
                          <div className="relative">
                            <input
                              id={field.name}
                              name={field.name}
                              type="text"
                              value={value}
                              placeholder={placeholder}
                              onChange={(event) =>
                                onValueChange(field.name, event.target.value)
                              }
                              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] ${
                                fieldError ? "border-red-400" : "border-slate-300"
                              }`}
                              autoComplete="off"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center text-slate-400">
                              {addressLoading ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                            </div>
                            {addressSuggestions.length > 0 && (
                              <ul className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                                {addressSuggestions.map((suggestion) => (
                                  <li
                                    key={suggestion.id}
                                    className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
                                    onMouseDown={() => {
                                      onValueChange(field.name, suggestion.label);
                                      setAddressSuggestions([]);
                                    }}
                                  >
                                    {suggestion.label}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )
                      : undefined
                  }
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
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#0C6CF2] text-white hover:bg-[#0848A3] flex items-center gap-2 shadow-soft-xl"
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
