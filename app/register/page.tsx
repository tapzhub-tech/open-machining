'use client';

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { CircleCheck as CheckCircle, Building2, Users, Settings, Wrench } from "lucide-react";
import { Navbar } from "@/components/navbar";

interface VendorData {
  companyName: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
  pancardNumber: string;
  gstNo: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  numberOfMachines: number;
  numberOfSkill: number;
  numberOfProgrammer: number;
  numberOfQualityTools: number;
  programmingType: 'design' | 'programming' | '';
  programmingMode: 'manual' | 'cam' | '';
  programmingManual: '' | 'yes' | 'no';
  programmingCam: '' | 'yes' | 'no';
  totalManpower: '' | '0-10' | '10-30' | '31-50' | 'above-50';
  designType: '' | 'inhouse' | 'outsource';
  expertise: string;

  vice: string;
  anglePlates: string;
  specialFixture: string;

  boringBar: string;
  antiVibrationTool: string;
  highFeedTool: string;
  advanceTooling: string;

  industries: string[];
}

interface MachineSpec {
  machineCategory: 'CNC' | 'Conventional' | null;
  machineCode: string | null;
  mappedSubtype: string | null;
  sizeChoice: 'diameter' | 'xy' | null;
  diameterValue: string;
  sizeXAxis: string;
  sizeYAxis: string;
  sizeZAxis: string;
  accuracySelection: string | null;
  powerSelection: string | null;
  advanceSoftwareSelection: string | null;
  advanceOthers: string[];

  yearOfInstallation: string;
  machineBrand: string;
}

const defaultMachineSpec = (): MachineSpec => ({
  machineCategory: null,
  machineCode: null,
  mappedSubtype: null,
  sizeChoice: null,
  diameterValue: '',
  sizeXAxis: '',
  sizeYAxis: '',
  sizeZAxis: '',
  accuracySelection: null,
  powerSelection: null,
  advanceSoftwareSelection: null,
  advanceOthers: [],

  yearOfInstallation: '',
  machineBrand: '',
});

function normalizePan(pan: string) {
  return pan ? pan.trim().toUpperCase() : '';
}
function normalizeGst(gst: string) {
  return gst ? gst.trim().toUpperCase() : '';
}
function validatePAN(panRaw: string) {
  const pan = normalizePan(panRaw);
  const re = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  return re.test(pan);
}
function validateGST(gstRaw: string) {
  const gst = normalizeGst(gstRaw);
  const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/;
  return re.test(gst);
}
function gstContainsPan(gstRaw: string, panRaw: string) {
  const gst = normalizeGst(gstRaw);
  const pan = normalizePan(panRaw);
  if (gst.length < 15 || pan.length !== 10) return false;
  const gstPan = gst.substr(2, 10);
  return gstPan === pan;
}
function validatePhone(phone: string) {
  const p = (phone || '').trim();
  return /^\d{10}$/.test(p);
}
function validateEmail(email: string) {
  const e = (email || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export default function RegisterVendor() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [vendorData, setVendorData] = useState<VendorData>({
    companyName: "",
    ownerName: "",
    phoneNumber: "",
    email: "",
    pancardNumber: "",
    gstNo: "",
    address: "",
    state: "",
    city: "",
    pincode: "", // ✅ ADD HERE

    numberOfMachines: 0,
    numberOfSkill: 10,
    numberOfProgrammer: 10,
    numberOfQualityTools: 0,
    programmingType: '',
    programmingMode: '',
    programmingManual: '',
    programmingCam: '',
    totalManpower: '',
    designType: '',
    expertise: '',
    vice: '',
    anglePlates: '',
    specialFixture: '',
    boringBar: '',
    antiVibrationTool: '',
    highFeedTool: '',
    advanceTooling: '',
    industries: [],
  });

  const [machines, setMachines] = useState<MachineSpec[]>([]);
  const [advanceOtherInputs, setAdvanceOtherInputs] = useState<Record<number, string>>({});

  const state_arr = [
    "Andaman & Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
    "Dadra & Nagar Haveli", "Daman & Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
    "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Pondicherry", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Tripura", "Uttar Pradesh", "Uttaranchal", "West Bengal"
  ];

  const s_a = [
    "",
    " Alipur | Andaman Island | Anderson Island | Arainj-Laka-Punga | Austinabad | Bamboo Flat | Barren Island | Beadonabad | Betapur | Bindraban | Bonington | Brookesabad | Cadell Point | Calicut | Chetamale | Cinque Islands | Defence Island | Digilpur | Dolyganj | Flat Island | Geinyale | Great Coco Island | Haddo | Havelock Island | Henry Lawrence Island | Herbertabad | Hobdaypur | Ilichar | Ingoie | Inteview Island | Jangli Ghat | Jhon Lawrence Island | Karen | Kartara | KYD Islannd | Landfall Island | Little Andmand | Little Coco Island | Long Island | Maimyo | Malappuram | Manglutan | Manpur | Mitha Khari | Neill Island | Nicobar Island | North Brother Island | North Passage Island | North Sentinel Island | Nothen Reef Island | Outram Island | Pahlagaon | Palalankwe | Passage Island | Phaiapong | Phoenix Island | Port Blair | Preparis Island | Protheroepur | Rangachang | Rongat | Rutland Island | Sabari | Saddle Peak | Shadipur | Smith Island | Sound Island | South Sentinel Island | Spike Island | Tarmugli Island | Taylerabad | Titaije | Toibalawe | Tusonabad | West Island | Wimberleyganj | Yadita",
    " Achampet | Adilabad | Adoni | Alampur | Allagadda | Alur | Amalapuram | Amangallu | Anakapalle | Anantapur | Andole | Araku | Armoor | Asifabad | Aswaraopet | Atmakur | B. Kothakota | Badvel | Banaganapalle | Bandar | Bangarupalem | Banswada | Bapatla | Bellampalli | Bhadrachalam | Bhainsa | Bheemunipatnam | Bhimadole | Bhimavaram | Bhongir | Bhooragamphad | Boath | Bobbili | Bodhan | Chandoor | Chavitidibbalu | Chejerla | Chepurupalli | Cherial | Chevella | Chinnor | Chintalapudi | Chintapalle | Chirala | Chittoor | Chodavaram | Cuddapah | Cumbum | Darsi | Devarakonda | Dharmavaram | Dichpalli | Divi | Donakonda | Dronachalam | East Godavari | Eluru | Eturnagaram | Gadwal | Gajapathinagaram | Gajwel | Garladinne | Giddalur | Godavari | Gooty | Gudivada | Gudur | Guntur | Hindupur | Hunsabad | Huzurabad | Huzurnagar | Hyderabad | Ibrahimpatnam | Jaggayyapet | Jagtial | Jammalamadugu | Jangaon | Jangareddygudem | Jannaram | Kadiri | Kaikaluru | Kakinada | Kalwakurthy | Kalyandurg | Kamalapuram | Kamareddy | Kambadur | Kanaganapalle | Kandukuru | Kanigiri | Karimnagar | Kavali | Khammam | Khanapur (AP) | Kodangal | Koduru | Koilkuntla | Kollapur | Kothagudem | Kovvur | Krishna | Krosuru | Kuppam | Kurnool | Lakkireddipalli | Madakasira | Madanapalli | Madhira | Madnur | Mahabubabad | Mahabubnagar | Mahadevapur | Makthal | Mancherial | Mandapeta | Mangalagiri | Manthani | Markapur | Marturu | Medachal | Medak | Medarmetla | Metpalli | Mriyalguda | Mulug | Mylavaram | Nagarkurnool | Nalgonda | Nallacheruvu | Nampalle | Nandagama | Nandikotkur | Nandyal | Narasampet | Narasaraopet | Narayanakhed | Narayanpet | Narsapur | Narsipatnam | Nazvidu | Nelloe | Nellore | Nidamanur | Nirmal | Nizamabad | Nuguru | Ongole | Outsarangapalle | Paderu | Pakala | Palakonda | Paland | Palmaneru | Pamuru | Pargi | Parkal | Parvathipuram | Pathapatnam | Pattikonda | Peapalle | Peddapalli | Peddapuram | Penukonda | Piduguralla | Piler | Pithapuram | Podili | Polavaram | Prakasam | Proddatur | Pulivendla | Punganur | Putturu | Rajahmundri | Rajampeta | Ramachandrapuram | Ramannapet | Rampachodaram | Rangareddy | Rapur | Rayachoti | Rayadurg | Razole | Repalle | Saluru | Sangareddy | Sathupalli | Sattenapalle | Satyavedu | Shadnagar | Siddavattam | Siddipet | Sileru | Sircilla | Sirpur Kagaznagar | Sodam | Sompeta | Srikakulam | Srikalahasthi | Srisailam | Srungavarapukota | Sudhimalla | Sullarpet | Tadepalligudem | Tadpatri | Tanduru | Tanuku | Tekkali | Tenali | Thungaturthy | Tirivuru | Tirupathi | Tuni | Udaygiri | Ulvapadu | Uravakonda | Utnor | V.R. Puram | Vaimpalli | Vayalpad | Venkatgiri | Venkatgirikota | Vijayawada | Vikrabad | Vinjamuru | Vinukonda | Visakhapatnam | Vizayanagaram | Vizianagaram | Vuyyuru | Wanaparthy | Warangal | Wardhannapet | Yelamanchili | Yelavaram | Yeleswaram | Yellandu | Yellanuru | Yellareddy | Yerragondapalem | Zahirabad",
  ];

  const stateToCities = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (let i = 0; i < state_arr.length; i++) {
      const stateKey = (state_arr[i] || "").trim();
      const sIndex = i + 1;
      const citiesRaw = (s_a[sIndex] || "").trim();
      if (!citiesRaw) {
        map[stateKey] = [];
        continue;
      }
      const cities = citiesRaw.split("|").map(c => c.trim()).filter(Boolean);
      map[stateKey] = cities;
    }
    return map;
  }, []);
  const list21 = ["Cliche", "Turnmill", "Turn Mill with Y-axis"];
  const list22 = ["VMC", "HMC", "VMC with 4-axis"];
  const list23 = ["Hobbing", "Shaping", "Bevel Cutting", "Spline Cutting"];
  const list24 = [
    "Surface Grinding",
    "Outside & Surface",
    "Endside & Surface",
    "Universal Type",
    "Gear Grinding",
    "Spline Grinding",
  ];
  const list27 = ["Mill Turn", "Vertical", "Horizontal"];

  const diameterBuckets = ["0–300 mm", "300–600 mm", "600–1500 mm", "More than 1500 mm"];
  const xAxisOptions = [
    "Less than 100 mm",
    "100 – 300 mm",
    "300 – 600 mm",
    "600 – 1000 mm",
    "1000 – 1500 mm",
    "More than 1500 mm",
  ];
  const yAxisOptions = ["Less than 500 mm", "500 – 1000 mm", "More than 1000 mm"];
  const zAxisOptions = [...xAxisOptions];
  const accuracyOptions = ["0–10 Micron", "10–20 Micron", "20–50 Micron", "Above 50 Micron"];

  const powerOptions = [
    "Less than 10 kW",
    "10 kW – 20 kW",
    "20 kW – 40 kW",
    "40 kW – 60 kW",
    "More than 60 kW",
  ];
  const advanceSoftwareOptions = [
    "Touch Probe",
    "Dynamic Function",
    "Simultaneous Machining",
    "Industry 4.0",
    "Others",
  ];

  const cnnToSubtypeMap: Record<string, string[]> = {
    "20.1": list21,
    "20.2": list22,
    "20.3": list27,
    "20.4": list23,
    "20.5": list24,
    "20.6": [],
    "20.7": [],
  };

  const machineCodeLabel: Record<string, string> = {
    "20.1": "Turn",
    "20.2": "Milling",
    "20.3": "5-Axis",
    "20.4": "Gear Cutting",
    "20.5": "Grinding",
    "20.6": "Wire Cutting",
    "20.7": "3-D Printing",
  };
  const machineOptions = Object.entries(machineCodeLabel).map(([value, label]) => ({ value, label }));

  const handleInputChange = (
    field: keyof VendorData,
    value: string | number
  ) => {
    setVendorData(prev => ({
      ...prev,
      [field]: value,
    }));

    setErrors(prev => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

    if (field === 'programmingType') {
      const v = String(value);
      if (v === 'design' || v === '') {
        setVendorData(prev => ({
          ...prev,
          programmingManual: '',
          programmingCam: '',
          programmingMode: '',
        }));
      }
    }
  };


  const industriesList = [
    "Aerospace",
    "Automotive",
    "Automation & Robotics",
    "Medical Devices",
    "Consumer Products",
    "Energy & Power",
  ];

  const toggleIndustry = (name: string) => {
    setVendorData(prev => {
      const nextSet = new Set(prev.industries || []);
      if (nextSet.has(name)) nextSet.delete(name);
      else nextSet.add(name);
      return { ...prev, industries: Array.from(nextSet) } as VendorData;
    });
  };

  const cloneMachine = (m: MachineSpec): MachineSpec => JSON.parse(JSON.stringify(m));

  const handleMachineCountChange = (count: number) => {
    setVendorData(prev => ({ ...prev, numberOfMachines: count }));
    setMachines(prev => {
      if (count === prev.length) return prev;
      if (count > prev.length) {
        const toAdd = count - prev.length;
        const newMachines: MachineSpec[] = [];
        for (let i = 0; i < toAdd; i++) newMachines.push(defaultMachineSpec());
        return [...prev, ...newMachines];
      } else {
        setAdvanceOtherInputs(prevInputs => {
          const next: Record<number, string> = {};
          for (let i = 0; i < count; i++) {
            if (prevInputs[i]) next[i] = prevInputs[i];
          }
          return next;
        });
        return prev.slice(0, count);
      }
    });
  };

  const updateMachineAt = (index: number, patch: Partial<MachineSpec>) => {
    setMachines(prev => {
      const copy = prev.map(m => ({ ...m }));
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });
  };

  const addAdvanceOtherForMachine = (index: number) => {
    const val = (advanceOtherInputs[index] || "").trim();
    if (!val) return;
    updateMachineAt(index, {
      advanceOthers: Array.from(new Set([...(machines[index]?.advanceOthers || []), val])),
    });
    setAdvanceOtherInputs(prev => ({ ...prev, [index]: "" }));
  };

  const removeAdvanceOtherForMachine = (index: number, value: string) => {
    updateMachineAt(index, { advanceOthers: (machines[index]?.advanceOthers || []).filter(x => x !== value) });
  };

  const copyMachineFrom = (targetIndex: number, sourceIndex: number) => {
    if (!machines[sourceIndex]) return;
    const cloned = cloneMachine(machines[sourceIndex]);
    setMachines(prev => {
      const copy = prev.map(m => ({ ...m }));
      copy[targetIndex] = cloned;
      return copy;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!vendorData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!vendorData.ownerName.trim()) newErrors.ownerName = "Owner name is required";
    if (!vendorData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!validatePhone(vendorData.phoneNumber)) newErrors.phoneNumber = "Phone must be 10 digits";
    if (!vendorData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(vendorData.email)) newErrors.email = "Invalid email";

    if (vendorData.pancardNumber && vendorData.pancardNumber.trim() && !validatePAN(vendorData.pancardNumber)) {
      newErrors.pancardNumber = "Invalid PAN format (ex: ABCDE1234F)";
    }

    if (!vendorData.gstNo.trim()) newErrors.gstNo = "GST number is required";
    else if (!validateGST(vendorData.gstNo)) newErrors.gstNo = "Invalid GST format (15 chars)";

    if (vendorData.pancardNumber && vendorData.pancardNumber.trim() && vendorData.gstNo && vendorData.gstNo.trim()) {
      if (!gstContainsPan(vendorData.gstNo, vendorData.pancardNumber)) {
        newErrors.gstNo = "GST does not contain the PAN provided";
      }
    }

    if (!vendorData.address.trim()) newErrors.address = "Address is required";
    if (!vendorData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(vendorData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    // if (!vendorData.state.trim()) newErrors.state = "State is required";
    // if (!vendorData.city.trim()) newErrors.city = "City is required";

    if (vendorData.numberOfMachines > 0 && machines.length !== vendorData.numberOfMachines) {
      newErrors.numberOfMachines = "Machine specs not synced with count";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = { ...vendorData, machines };
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        const json = await response.json().catch(() => null);
        const msg = (json && json.error) ? json.error : 'Failed to submit vendor data';
        setErrors(prev => ({ ...prev, submit: typeof msg === 'string' ? msg : 'Submission failed' }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, submit: 'Unexpected error' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const stateKey = vendorData.state ? vendorData.state.trim() : '';
  const currentCities = stateKey ? (stateToCities[stateKey] || []) : [];

  if (submitSuccess) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center font-sans pt-20 md:pt-24">
          <Card className="w-full max-w-md mx-4 border border-slate-200 rounded-lg shadow-lg">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-14 w-14 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Registration successful!</h2>
              <p className="text-slate-700 mb-2">Vendor has been registered successfully.</p>
              {vendorData.email && <p className="text-slate-700 mb-4">A confirmation email has been sent to <span className="font-medium">{vendorData.email}</span>.</p>}
              <div className="mt-4">
                <Button onClick={() => router.push('/')} className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md">Go to Home</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 font-sans pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-1">Register New Vendor</h1>
              <p className="text-sm text-slate-600">Fill in the details below to register a new vendor in the system.</p>
            </div>

            <Card className="mb-8 border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-800 text-white py-3 px-4 rounded-t-lg">
                <CardTitle className="flex items-center text-sm font-medium">
                  <Building2 className="h-4 w-4 mr-2" />
                  Vendor Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 bg-white">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName" className="text-sm text-slate-700">Company Name *</Label>
                    <Input id="companyName" value={vendorData.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} placeholder="Enter company name" className={`mt-1 bg-white border ${errors.companyName ? 'border-red-400' : 'border-slate-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200`} />
                    {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="ownerName" className="text-sm text-slate-700">Owner Name *</Label>
                    <Input id="ownerName" value={vendorData.ownerName} onChange={(e) => handleInputChange('ownerName', e.target.value)} placeholder="Enter owner name" className={`mt-1 bg-white border ${errors.ownerName ? 'border-red-400' : 'border-slate-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200`} />
                    {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber" className="text-sm text-slate-700">Phone Number *</Label>
                    <Input id="phoneNumber" value={vendorData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} placeholder="Enter phone number" className={`mt-1 bg-white border ${errors.phoneNumber ? 'border-red-400' : 'border-slate-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200`} />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm text-slate-700">Email *</Label>
                    <Input id="email" value={vendorData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="Enter email address" className={`mt-1 bg-white border ${errors.email ? 'border-red-400' : 'border-slate-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200`} />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="pancardNumber" className="text-sm text-slate-700">Pancard Number  *</Label>
                    <Input id="pancardNumber" value={vendorData.pancardNumber} onChange={(e) => handleInputChange('pancardNumber', e.target.value)} placeholder="Enter pancard number (ABCDE1234F)" className={`mt-1 bg-white border ${errors.pancardNumber ? 'border-red-400' : 'border-slate-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200`} />
                    {errors.pancardNumber && <p className="text-red-500 text-sm mt-1">{errors.pancardNumber}</p>}
                  </div>

                  <div>
                    <Label htmlFor="gstNo" className="text-sm text-slate-700">GST No *</Label>
                    <Input id="gstNo" value={vendorData.gstNo} onChange={(e) => handleInputChange('gstNo', e.target.value)} placeholder="Enter GST number (15 chars)" className={`mt-1 bg-white border ${errors.gstNo ? 'border-red-400' : 'border-slate-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200`} />
                    {errors.gstNo && <p className="text-red-500 text-sm mt-1">{errors.gstNo}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-sm text-slate-700">Address *</Label>
                    <Textarea id="address" value={vendorData.address} onChange={(e) => handleInputChange('address', e.target.value)} placeholder="Enter complete address" rows={3} className={`mt-1 bg-white border ${errors.address ? 'border-red-400' : 'border-slate-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200`} />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <Label className="text-sm text-slate-700">State</Label>
                    <Select value={vendorData.state || undefined} onValueChange={(v: string) => {
                      const trimmed = (v || '').toString().trim();
                      setVendorData(prev => ({ ...prev, state: trimmed, city: '' }));
                    }}>
                      <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {state_arr.map((s) => {
                          const sv = (s || '').toString().trim();
                          return <SelectItem key={sv} value={sv}>{sv}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <Label className="text-sm text-slate-700">City</Label>


                    {stateKey && currentCities.length === 0 ? (
                      <div>
                        <Input
                          placeholder="Enter city (not listed)"
                          value={vendorData.city}
                          onChange={(e) => setVendorData(prev => ({ ...prev, city: e.target.value }))}
                          className={`mt-1 bg-white border ${errors.city ? 'border-red-400' : 'border-slate-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                        />
                        <p className="text-sm text-slate-400 mt-1">Enter your city if not listed.</p>
                      </div>


                    ) : (
                      <Select value={vendorData.city || undefined} onValueChange={(v: string) => {
                        const trimmedCity = (v || '').toString().trim();
                        setVendorData(prev => ({ ...prev, city: trimmedCity }));
                      }}>
                        <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentCities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}

                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="pincode" className="text-sm text-slate-700">
                      Pincode *
                    </Label>
                    <Input
                      id="pincode"
                      inputMode="numeric"
                      maxLength={6}
                      value={vendorData.pincode}
                      onChange={(e) => {
                        const onlyDigits = e.target.value.replace(/\D/g, '');
                        handleInputChange('pincode', onlyDigits);
                      }}
                      placeholder="Enter 6 digit pincode"

                      className={`mt-1 bg-white border ${errors.pincode ? 'border-red-400' : 'border-slate-200'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                    )}
                  </div>


                </div>


              </CardContent>
            </Card>

            <Card className="mb-8 border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-800 text-white py-3 px-4 rounded-t-lg">
                <CardTitle className="flex items-center text-sm font-medium">
                  <Settings className="h-4 w-4 mr-2" />
                  Machine Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6 bg-white">
                <div>
                  <Label className="text-sm text-slate-700">Number of Machines</Label>
                  <Select value={vendorData.numberOfMachines > 0 ? vendorData.numberOfMachines.toString() : undefined} onValueChange={(value: string) => handleMachineCountChange(Number(value))}>
                    <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                      <SelectValue placeholder="Select count" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 21 }, (_, i) => <SelectItem key={i} value={i.toString()}>{i}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.numberOfMachines && <p className="text-red-500 text-sm mt-1">{errors.numberOfMachines}</p>}
                </div>

                {machines.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {machines.map((m, idx) => {
                      const mappedSubtypeOptions = m.machineCode ? (cnnToSubtypeMap[m.machineCode] || []) : [];
                      const selectedMachineLabel = m.machineCode ? (machineCodeLabel[m.machineCode] ?? "Subtype") : "Subtype";

                      return (
                        <div key={idx} className="p-4 border rounded-md border-slate-100 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm text-slate-800">Machine {idx + 1}</h4>
                            <div className="flex items-center gap-2">
                              {machines.length > 1 && (
                                <div className="flex items-center gap-2">
                                  <Label className="text-xs text-slate-600">Copy from</Label>
                                  <Select onValueChange={(v: string) => {
                                    const src = Number(v) - 1;
                                    if (!isNaN(src) && src >= 0) copyMachineFrom(idx, src);
                                  }}>
                                    <SelectTrigger className="rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                      <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={"0"}>None</SelectItem>
                                      {machines.map((_, j) => j !== idx && (<SelectItem key={j} value={(j + 1).toString()}>{`Machine ${j + 1}`}</SelectItem>))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mb-3">
                            <Label className="text-sm text-slate-700">Machine Category</Label>
                            <div className="mt-2 flex items-center gap-6">
                              <label className="flex items-center cursor-pointer select-none gap-2">
                                <input type="radio" name={`machineCategory-${idx}`} value="CNC" checked={m.machineCategory === 'CNC'} onChange={() => updateMachineAt(idx, { machineCategory: 'CNC' })} className="sr-only" />
                                <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${m.machineCategory === 'CNC' ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`} aria-hidden>{m.machineCategory === 'CNC' && <span className="block w-2.5 h-2.5 rounded-full bg-white" />}</span>
                                <span className={`text-sm ${m.machineCategory === 'CNC' ? 'font-medium text-slate-900' : 'text-slate-700'}`}>CNC</span>
                              </label>

                              <label className="flex items-center cursor-pointer select-none gap-2">
                                <input type="radio" name={`machineCategory-${idx}`} value="Conventional" checked={m.machineCategory === 'Conventional'} onChange={() => updateMachineAt(idx, { machineCategory: 'Conventional' })} className="sr-only" />
                                <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${m.machineCategory === 'Conventional' ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`} aria-hidden>{m.machineCategory === 'Conventional' && <span className="block w-2.5 h-2.5 rounded-full bg-white" />}</span>
                                <span className={`text-sm ${m.machineCategory === 'Conventional' ? 'font-medium text-slate-900' : 'text-slate-700'}`}>Conventional</span>
                              </label>
                            </div>
                          </div>

                          <div className="mb-3">
                            <Label className="text-sm text-slate-700">Machine Type</Label>
                            <Select value={m.machineCode || undefined} onValueChange={(value: string) => updateMachineAt(idx, { machineCode: value, mappedSubtype: null, sizeChoice: null, diameterValue: '', sizeXAxis: '', sizeYAxis: '', sizeZAxis: '', accuracySelection: null, powerSelection: null, advanceSoftwareSelection: null, advanceOthers: [] })}>
                              <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {machineOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>

                          {m.machineCode && mappedSubtypeOptions.length > 0 && (
                            <div className="mb-3">
                              <Label className="text-sm text-slate-700">{selectedMachineLabel}</Label>
                              <Select value={m.mappedSubtype || undefined} onValueChange={(v: string) => updateMachineAt(idx, { mappedSubtype: v })}>
                                <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                  <SelectValue placeholder="Select subtype" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mappedSubtypeOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div>
                              <Label className="text-sm text-slate-700">Year of Installation</Label>
                              <Input
                                type="number"
                                min={1900}
                                max={2100}
                                placeholder="e.g. 2020"
                                value={m.yearOfInstallation || ''}
                                onChange={(e) => updateMachineAt(idx, { yearOfInstallation: e.target.value })}
                                className="mt-1 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                              />
                            </div>

                            <div>
                              <Label className="text-sm text-slate-700">Machine Brand</Label>
                              <Input
                                placeholder="Type machine brand"
                                value={m.machineBrand || ''}
                                onChange={(e) => updateMachineAt(idx, { machineBrand: e.target.value })}
                                className="mt-1 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                              />
                            </div>
                          </div>

                          {m.machineCategory === 'CNC' && m.machineCode && ['20.1', '20.2', '20.3', '20.4', '20.5'].includes(m.machineCode) && (
                            <div className="pt-4 border-t">
                              <h5 className="font-medium mb-3 text-sm text-slate-800">Machine Specification (CNC)</h5>
                              <div className="border rounded p-4 border-slate-100 bg-white">
                                <div className="grid grid-cols-2 gap-4 items-start">
                                  <div className="text-sm font-medium text-slate-700">Size</div>
                                  <div>
                                    <div className="flex gap-3 items-center mb-2">
                                      <label className="flex items-center gap-2">
                                        <input type="radio" name={`sizeChoice-${idx}`} value="diameter" checked={m.sizeChoice === 'diameter'} onChange={() => updateMachineAt(idx, { sizeChoice: 'diameter' })} className="form-radio" />
                                        <span className="text-sm text-slate-700">Diameter</span>
                                      </label>
                                      <label className="flex items-center gap-2">
                                        <input type="radio" name={`sizeChoice-${idx}`} value="xy" checked={m.sizeChoice === 'xy'} onChange={() => updateMachineAt(idx, { sizeChoice: 'xy' })} className="form-radio" />
                                        <span className="text-sm text-slate-700">X / Y / Z</span>
                                      </label>
                                    </div>

                                    {m.sizeChoice === 'diameter' && (
                                      <div>
                                        <Label className="mb-1 text-sm text-slate-700">Diameter (classification)</Label>
                                        <Select value={m.diameterValue || undefined} onValueChange={(v: string) => updateMachineAt(idx, { diameterValue: v })}>
                                          <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                            <SelectValue placeholder="Select diameter" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {diameterBuckets.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}

                                    {m.sizeChoice === 'xy' && (
                                      <div className="grid grid-cols-3 gap-2">
                                        <div>
                                          <Label className="mb-1 text-sm text-slate-700">X-Axis</Label>
                                          <Select value={m.sizeXAxis || undefined} onValueChange={(v: string) => updateMachineAt(idx, { sizeXAxis: v })}>
                                            <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                              <SelectValue placeholder="Select X" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {xAxisOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <Label className="mb-1 text-sm text-slate-700">Y-Axis</Label>
                                          <Select value={m.sizeYAxis || undefined} onValueChange={(v: string) => updateMachineAt(idx, { sizeYAxis: v })}>
                                            <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                              <SelectValue placeholder="Select Y" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {yAxisOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <Label className="mb-1 text-sm text-slate-700">Z-Axis</Label>
                                          <Select value={m.sizeZAxis || undefined} onValueChange={(v: string) => updateMachineAt(idx, { sizeZAxis: v })}>
                                            <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                              <SelectValue placeholder="Select Z" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {zAxisOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    )}

                                    {!m.sizeChoice && <div className="text-sm text-slate-400">Choose Diameter or X / Y / Z and select values.</div>}
                                  </div>

                                  <div className="text-sm font-medium text-slate-700">Accuracy</div>
                                  <div>
                                    <Select value={m.accuracySelection || undefined} onValueChange={(v: string) => updateMachineAt(idx, { accuracySelection: v })}>
                                      <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                        <SelectValue placeholder="Select accuracy" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {accuracyOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="text-sm font-medium text-slate-700">Power</div>
                                  <div>
                                    <Select value={m.powerSelection || undefined} onValueChange={(v: string) => updateMachineAt(idx, { powerSelection: v })}>
                                      <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                        <SelectValue placeholder="Select power" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {powerOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="text-sm font-medium text-slate-700">Advanced Software</div>
                                  <div>
                                    <Select value={m.advanceSoftwareSelection || undefined} onValueChange={(v: string) => updateMachineAt(idx, { advanceSoftwareSelection: v })}>
                                      <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                        <SelectValue placeholder="Select software" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {advanceSoftwareOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                      </SelectContent>
                                    </Select>

                                    {m.advanceSoftwareSelection === 'Others' && (
                                      <div className="mt-3">
                                        <Label className="text-sm mb-1 text-slate-700">Other</Label>
                                        <div className="flex gap-2">
                                          <Input placeholder="Add new value" value={advanceOtherInputs[idx] || ''} onChange={(e) => setAdvanceOtherInputs(prev => ({ ...prev, [idx]: e.target.value }))} className="border-slate-200 rounded-md" />
                                          <Button onClick={() => addAdvanceOtherForMachine(idx)} className="rounded-md bg-indigo-600 hover:bg-indigo-700 text-white">Add</Button>
                                        </div>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                          {(m.advanceOthers || []).map(val => (
                                            <div key={val} className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded text-sm">
                                              <span className="text-slate-700">{val}</span>
                                              <button type="button" onClick={() => removeAdvanceOtherForMachine(idx, val)} className="text-red-500 text-xs">×</button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mb-8 border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-800 text-white py-3 px-4 rounded-t-lg">
                <CardTitle className="flex items-center text-sm font-medium">
                  <Users className="h-4 w-4 mr-2" />
                  Manpower Details
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6 bg-white">
                <div>
                  <Label className="text-sm text-slate-700">Total no of Manpower</Label>
                  <Select value={vendorData.totalManpower || undefined} onValueChange={(v: string) => handleInputChange('totalManpower', v as VendorData['totalManpower'])}>
                    <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-10">0-10</SelectItem>
                      <SelectItem value="10-30">10-30</SelectItem>
                      <SelectItem value="31-50">31-50</SelectItem>
                      <SelectItem value="above-50">Above 50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Technical Staff</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="numberOfSkill" className="text-sm text-slate-700">No. of Technical Staff</Label>
                      <Input id="numberOfSkill" type="number" min={0} value={vendorData.numberOfSkill} onChange={(e) => handleInputChange('numberOfSkill', Number(e.target.value))} placeholder="Enter number of technical staff" className="mt-1 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>

                    <div>
                      <Label htmlFor="numberOfProgrammer" className="text-sm text-slate-700">No. of Programmer</Label>
                      <Input id="numberOfProgrammer" type="number" min={0} value={vendorData.numberOfProgrammer} onChange={(e) => handleInputChange('numberOfProgrammer', Number(e.target.value))} placeholder="Enter number of programmers" className="mt-1 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-slate-700">Design</Label>
                  <Select value={vendorData.designType || undefined} onValueChange={(v: string) => handleInputChange('designType', v as VendorData['designType'])}>
                    <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                      <SelectValue placeholder="Select design type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inhouse">Inhouse</SelectItem>
                      <SelectItem value="outsource">Outsource</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm text-slate-700 mb-2">Manual</Label>
                    <Select value={vendorData.programmingManual || undefined} onValueChange={(v: string) => handleInputChange('programmingManual', v as VendorData['programmingManual'])}>
                      <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm text-slate-700 mb-2">CAM Software</Label>
                    <Select value={vendorData.programmingCam || undefined} onValueChange={(v: string) => handleInputChange('programmingCam', v as VendorData['programmingCam'])}>
                      <SelectTrigger className="mt-1 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-slate-700">Expertise</Label>
                  <Textarea
                    placeholder="Describe your expertise (max 4000 chars)"
                    rows={6}
                    maxLength={4000}
                    value={vendorData.expertise}
                    onChange={(e) => handleInputChange('expertise', e.target.value)}
                    className="mt-1 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                  <div className="text-sm text-slate-400 mt-1">{vendorData.expertise.length} / 4000</div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-800 text-white py-3 px-4 rounded-t-lg">
                <CardTitle className="flex items-center text-sm font-medium">
                  <Wrench className="h-4 w-4 mr-2" />
                  Tools & Fixtures Information
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6 bg-white">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Fixture</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm text-slate-700">Vice</Label>
                      <Input value={vendorData.vice} onChange={(e) => handleInputChange('vice', e.target.value)} placeholder="Enter vice details" className="mt-1 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>

                    <div>
                      <Label className="text-sm text-slate-700">Angle Plates</Label>
                      <Input value={vendorData.anglePlates} onChange={(e) => handleInputChange('anglePlates', e.target.value)} placeholder="Enter angle plates details" className="mt-1 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>

                    <div>
                      <Label className="text-sm text-slate-700">Special Fixture</Label>
                      <Input value={vendorData.specialFixture} onChange={(e) => handleInputChange('specialFixture', e.target.value)} placeholder="Enter special fixture details" className="mt-1 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Tools</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-slate-700">Boring Bar</Label>
                      <Input value={vendorData.boringBar} onChange={(e) => handleInputChange('boringBar', e.target.value)} placeholder="Enter boring bar details" className="mt-1 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>

                    <div>
                      <Label className="text-sm text-slate-700">Anti Vibration tool</Label>
                      <Input value={vendorData.antiVibrationTool} onChange={(e) => handleInputChange('antiVibrationTool', e.target.value)} placeholder="Enter anti vibration tool details" className="mt-1 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>

                    <div>
                      <Label className="text-sm text-slate-700">High feed tool</Label>
                      <Input value={vendorData.highFeedTool} onChange={(e) => handleInputChange('highFeedTool', e.target.value)} placeholder="Enter high feed tool details" className="mt-1 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>

                    <div>
                      <Label className="text-sm text-slate-700">Advance Tooling (Heat shrink holder)</Label>
                      <Input value={vendorData.advanceTooling} onChange={(e) => handleInputChange('advanceTooling', e.target.value)} placeholder="Enter advance tooling details" className="mt-1 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-800 text-white py-3 px-4 rounded-t-lg">
                <CardTitle className="flex items-center text-sm font-medium">
                  <Building2 className="h-4 w-4 mr-2" />
                  Industries we serve
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {industriesList.map((ind) => {
                    const checked = vendorData.industries.includes(ind);
                    return (
                      <label key={ind} className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleIndustry(ind)}
                          className="w-4 h-4 rounded border-slate-300"
                        />
                        <span className="text-sm text-slate-700">{ind}</span>
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 rounded-lg shadow-sm">
              <CardContent className="p-6 bg-white">
                <div className="text-center">
                  {errors.submit && <p className="text-red-600 mb-3">{errors.submit}</p>}
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="inline-flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 text-white px-10 py-3 text-lg font-medium rounded-md">
                    {isSubmitting ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Submitting...</>) : 'Submit'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
