const TESTS = [
  {
    id: "haematology",
    name: "Haematology",
    parameters: [
      { id: "wbc", name: "WBC", unit: "10^3/ul", referenceRanges: { default: "4.0 - 11.0" } },
      { id: "neut", name: "Neut.", unit: "%", referenceRanges: { default: "40 - 75" } },
      { id: "lymph", name: "Lymph.", unit: "%", referenceRanges: { default: "20 - 45" } },
      { id: "eosin", name: "Eosin", unit: "%", referenceRanges: { default: "01 - 06" } },
      { id: "mono", name: "Mono", unit: "%", referenceRanges: { default: "01 - 10" } },
      { id: "baso", name: "Baso", unit: "%", referenceRanges: { default: "< 1" } },
      { id: "rbc", name: "RBC", unit: "10^6/ul", referenceRanges: { default: "3.5 - 5.5" } },
      { id: "hb", name: "HB", unit: "g/dl", referenceRanges: { default: "11.0 - 17.0" } },
      { id: "hct", name: "HCT", unit: "%", referenceRanges: { default: "26.0 - 50.0" } },
      { id: "mcv", name: "MCV", unit: "fl", referenceRanges: { default: "82.0 - 92.0" } },
      { id: "mch", name: "MCH", unit: "pg", referenceRanges: { default: "27.0 - 32.0" } },
      { id: "mchc", name: "MCHC", unit: "g/dl", referenceRanges: { default: "32.0 - 36.0" } },
      { id: "rdw_cv", name: "RDW-CV", unit: "%", referenceRanges: { default: "11.0 - 16.0" } },
      { id: "plt", name: "PLT.", unit: "10^3/ul", referenceRanges: { default: "150.0 - 450.0" } },
      { id: "mpv", name: "MPV", unit: "fl", referenceRanges: { default: "9.0 - 13.0" } },
      { id: "pdw", name: "PDW", unit: "fl", referenceRanges: { default: "9.0 - 17.0" } },
      { id: "pct", name: "PCT", unit: "%", referenceRanges: { default: "0.10 - 0.28" } },
      { id: "mp", name: "MP", unit: "", referenceRanges: { default: "Negative" } },
      { id: "esr", name: "ESR", unit: "mm/1st Hr.", referenceRanges: { default: "1 - 20" } }
    ]
  },
  {
    id: "lft",
    name: "L.F.T.",
    parameters: [
      { id: "bil_t", name: "S.Bilirubin (T)", unit: "mg/dl", referenceRanges: { default: "0.2 - 1.1" } },
      { id: "bil_d", name: "S.Bilirubin (D)", unit: "mg/dl", referenceRanges: { default: "0.0 - 0.2" } },
      { id: "sgot", name: "S.G.O.T", unit: "mg/dl", referenceRanges: { default: "0 - 45" } },
      { id: "sgpt", name: "S.G.P.T", unit: "mg/dl", referenceRanges: { default: "0 - 45" } },
      { id: "alk_phos", name: "Alk. Phosphatase", unit: "mg/dl", referenceRanges: { default: "100 - 250" } },
      { id: "t_protein", name: "T.Protein", unit: "mg/dl", referenceRanges: { default: "6.2 - 8.5" } },
      { id: "albumin", name: "Albumin", unit: "mg/dl", referenceRanges: { default: "3.5 - 5.3" } },
      { id: "globulin", name: "Globulin", unit: "mg/dl", referenceRanges: { default: "2.3 - 3.5" } }
    ]
  },
  {
    id: "biochemistry",
    name: "Biochemistry",
    parameters: [
      { id: "b_urea", name: "B.Urea", unit: "mg/dl", referenceRanges: { default: "15 - 45" } },
      { id: "s_creatinine", name: "S.Creatinine", unit: "mg/dl", referenceRanges: { default: "0.6 - 1.3" } },
      { id: "sodium", name: "Sodium", unit: "mmol/L", referenceRanges: { default: "135 - 150" } },
      { id: "potassium", name: "Potassium", unit: "mmol/L", referenceRanges: { default: "3.5 - 5.5" } },
      { id: "chloride", name: "Chloride", unit: "mmol/L", referenceRanges: { default: "94 - 110" } },
      { id: "s_uric_acid", name: "S.Uric Acid", unit: "mg/dl", referenceRanges: { default: "2.5 - 7.0" } },
      { id: "s_calcium", name: "S.Calcium", unit: "mg/dl", referenceRanges: { default: "8.5 - 10.5" } },
      { id: "b_sugar_f", name: "B.Sugar (F)", unit: "mg/dl", referenceRanges: { default: "70 - 110" } },
      { id: "b_sugar_pp", name: "B.Sugar (P.P)", unit: "mg/dl", referenceRanges: { default: "80 - 160" } },
      { id: "b_sugar_r", name: "B.Sugar (R)", unit: "mg/dl", referenceRanges: { default: "80 - 160" } },
      { id: "s_amylase", name: "S.Amylase", unit: "IU/L", referenceRanges: { default: "20 - 110" } },
      { id: "s_lipase", name: "S.Lipase", unit: "IU/L", referenceRanges: { default: "13 - 60" } }
    ]
  },
  {
    id: "gtt",
    name: "Glucose Tolerance Test (GTT)",
    parameters: [
      { id: "gtt_f", name: "B.Sugar (F) Fasting", unit: "mg/dl", referenceRanges: { default: "70 - 120" } },
      { id: "gtt_60", name: "60 Min. After 75gm Glucose", unit: "mg/dl", referenceRanges: { default: "" } },
      { id: "gtt_120", name: "120 Min. After Glucose", unit: "mg/dl", referenceRanges: { default: "" } }
    ]
  },
  {
    id: "hba1c",
    name: "Glycosylated Hemoglobin (HbA1c)",
    parameters: [
      { id: "hba1c_val", name: "HbA1c", unit: "%", referenceRanges: { default: "5.0 - 6.0 (Good: 6.0-7.0, Fair: 7.0-8.0, Poor: >8.0)" } },
      { id: "est_avg_sugar", name: "Estimated Average Sugar", unit: "mg/dl", referenceRanges: { default: "80 - 150" } }
    ]
  },
  {
    id: "cardiac_markers",
    name: "Cardiac Markers",
    parameters: [
      { id: "trop_t", name: "Trop T", unit: "", referenceRanges: { default: "Negative" } },
    ]
  },
  {
    id: "viral_markers",
    name: "Viral Markers",
    parameters: [
      { id: "trop_t", name: "Trop T", unit: "", referenceRanges: { default: "Negative" } },
      { id: "hiv", name: "HIV I & II", unit: "", referenceRanges: { default: "Non - Reactive" } },
      { id: "hcv", name: "HCV I & II", unit: "", referenceRanges: { default: "Non - Reactive" } },
      { id: "hbsag", name: "HBsAg", unit: "", referenceRanges: { default: "Non - Reactive" } },
      { id: "vdrl", name: "V.D.R.L.", unit: "", referenceRanges: { default: "Non - Reactive" } }
    ]
  },
  {
    id: "widal",
    name: "Widal",
    parameters: [
      { id: "s_typhi_o", name: "S. Typhi 'O'", unit: "", referenceRanges: { default: "< 1:80" } },
      { id: "s_typhi_h", name: "S. Typhi 'H'", unit: "", referenceRanges: { default: "< 1:80" } },
      { id: "s_paratyphi_ah", name: "S. Paratyphi 'AH'", unit: "", referenceRanges: { default: "< 1:80" } },
      { id: "s_paratyphi_bh", name: "S. Paratyphi 'BH'", unit: "", referenceRanges: { default: "< 1:80" } }
    ]
  },
  {
    id: "ra_factor_panel",
    name: "RA Factor",
    parameters: [
      { id: "ra_factor", name: "R.A.Factor", unit: "", referenceRanges: { default: "Negative" } },
      { id: "ra_quant", name: "R.A. Quantitative", unit: "IU/ml", referenceRanges: { default: "< 20.0" } }
    ]
  },
  {
    id: "urine_routine",
    name: "Urine Routine",
    parameters: [
      { id: "u_sugar", name: "U.Sugar", unit: "", referenceRanges: { default: "Nil" } },
      { id: "u_protein", name: "Protein", unit: "", referenceRanges: { default: "Nil" } },
      { id: "u_ph", name: "pH", unit: "", referenceRanges: { default: "Acidic" } },
      { id: "u_colour", name: "Colour", unit: "", referenceRanges: { default: "Pale Yellow" } },
      { id: "u_pus_cells", name: "Pus Cells", unit: "/HPF", referenceRanges: { default: "0 - 2" } },
      { id: "u_epi_cells", name: "Epithelial Cells", unit: "/HPF", referenceRanges: { default: "0 - 2" } },
      { id: "u_ca_oxalates", name: "Calcium Oxalates", unit: "/HPF", referenceRanges: { default: "0 - 1" } },
      { id: "u_rbc", name: "R.B.C.", unit: "/HPF", referenceRanges: { default: "0 - 1" } },
      { id: "u_amor_phos", name: "Amorphous Phosphates", unit: "/HPF", referenceRanges: { default: "0 - 1" } },
      { id: "u_spermatozoa", name: "Spermatozoa", unit: "/HPF", referenceRanges: { default: "Absent" } },
      { id: "u_preg", name: "Urine For Pregnancy Test", unit: "", referenceRanges: { default: "Negative" } },
      { id: "u_bile_salts", name: "Urine For Bile Salts", unit: "", referenceRanges: { default: "Negative" } },
      { id: "u_bile_pigments", name: "Urine For Bile Pigments", unit: "", referenceRanges: { default: "Negative" } },
      { id: "u_ketone", name: "Urine For Ketone Bodies", unit: "", referenceRanges: { default: "Negative" } }
    ]
  },
  {
    id: "stool_routine",
    name: "Stool Routine",
    parameters: [
      { id: "s_consistency", name: "Consistency", unit: "", referenceRanges: { default: "Formed / Semi Formed" } },
      { id: "s_mucous", name: "Mucous", unit: "", referenceRanges: { default: "Absent" } },
      { id: "s_undigested", name: "Undigested Food Particles", unit: "", referenceRanges: { default: "Absent" } },
      { id: "s_blood", name: "Blood", unit: "", referenceRanges: { default: "Absent" } },
      { id: "s_ova", name: "Ova", unit: "", referenceRanges: { default: "Not Seen" } },
      { id: "s_cysts", name: "Cysts", unit: "", referenceRanges: { default: "Not Seen" } }
    ]
  },
  {
    id: "semen_analysis",
    name: "Semen Analysis",
    parameters: [
      { id: "se_quantity", name: "Quantity", unit: "ml", referenceRanges: { default: "" } },
      { id: "se_liq_time", name: "Liquification Time", unit: "min", referenceRanges: { default: "" } },
      { id: "se_count", name: "Total Count", unit: "milli. / ml", referenceRanges: { default: "" } },
      { id: "se_motile", name: "Motile", unit: "%", referenceRanges: { default: "" } },
      { id: "se_sluggish", name: "Sluggish", unit: "%", referenceRanges: { default: "" } },
      { id: "se_dead", name: "Dead", unit: "%", referenceRanges: { default: "" } },
      { id: "se_pus", name: "Pus Cells", unit: "/HPF", referenceRanges: { default: "" } }
    ]
  },
  {
    id: "haemoglobin",
    name: "Haemoglobin",
    parameters: [
      { id: "hb_single", name: "HB", unit: "g/dl", referenceRanges: { default: "11.0 - 17.0" } }
    ]
  },
  {
    id: "coagulation",
    name: "Coagulation Profile",
    parameters: [
      { id: "bt", name: "B.T.", unit: "min", referenceRanges: { default: "2 - 5" } },
      { id: "ct", name: "C.T.", unit: "min", referenceRanges: { default: "5 - 10" } }
    ]
  },
  {
    id: "blood_group",
    name: "Blood Group",
    parameters: [
      { id: "abo", name: "ABO", unit: "", referenceRanges: { default: "" } },
      { id: "rh", name: "Rh", unit: "", referenceRanges: { default: "Positive / Negative" } }
    ]
  }
];

function getReferenceRange(param, patient) {
  const ranges = param.referenceRanges || {};
  const gender = (patient && patient.gender || "").toLowerCase();
  if (gender === "male" && ranges.male) return ranges.male;
  if (gender === "female" && ranges.female) return ranges.female;
  if (ranges.default) return ranges.default;
  return ranges.male || ranges.female || "";
}