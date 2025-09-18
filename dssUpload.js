// villageDataReader.js

export function getVillageData(fileName) {
  if (fileName === "village1.pdf") {
    return {
      claimant_information: {
        name_of_the_claimant: "Ramesh Debbarma",
        name_of_the_spouse: "Laxmi Debbarma",
        name_of_father_mother: "Kishore Debbarma",
        address: "House No. 123, Uttar Chelanga",
        village: "Uttar Chelanga",
        gram_panchayat: "Dhalai Gram Panchayat",
        tehsil_taluka: "Chailengta",
        district: "Dhalai",
        scheduled_tribe: "Yes",
        other_traditional_forest_dweller: "No",
        name_of_other_family_members: [
          { name: "Sita Debbarma", age: 15 },
          { name: "Suresh Debbarma", age: 12 }
        ]
      },
      nature_of_claim_on_land: {
        extent_of_forest_land_occupied: {
          for_habitation: "0.5 acres",
          for_self_cultivation: "2.0 acres"
        },
        disputed_lands_if_any: "None",
        pattas_leases_grants_if_any: "FRA Land Title for 2.5 acres (awaiting final vesting)",
        land_for_in_situ_rehabilitation_or_alternative_land_if_any: "Not applicable",
        land_from_where_displaced_without_land_compensation: "Not applicable",
        extent_of_land_in_forest_villages_if_any: "2.5 acres",
        any_other_traditional_right_if_any: "Right to collect minor forest produce (MFP) such as bamboo, fruits, and medicinal plants.",
        evidence_in_support: "Gram Sabha Resolution from Uttar Chelanga, Affidavit from village elders, Traditional boundary map, Voter ID, Aadhaar Card, ST Certificate.",
        any_other_information: "The village has signed a Memorandum of Understanding (MoU) with the state government for water infrastructure development under the Jal Jeevan Mission. The claimant has an active Job Card under MGNREGA and is a registered landholder with an Aadhaar and bank account linked to PM-KISAN."
      },
      schemes_eligibility: {
        jal_jeevan_mission: {
          qualifies: "Yes",
          reason: "The village is listed in the JJM priority list and has an MoU with the state. As an FRA-recognized tribal village, it is prioritized for FHTCs."
        },
        pm_kisan: {
          qualifies: "Yes",
          reason: "Claimant Ramesh Debbarma is a tribal landholder with a valid FRA land title. His Aadhaar and bank account are linked, and he does not fall under any exclusion criteria."
        },
        mgnrega: {
          qualifies: "Yes",
          reason: "The claimant resides in a rural area and has a Job Card. As an FRA landholder, he is eligible for asset-building work, aligning with the scheme's purpose."
        }
      }
    };
  } else if (fileName === "village2.pdf") {
    return {
      claimant_information: {
        name_of_the_claimant: "Dipali Reang",
        name_of_the_spouse: "Bikash Reang",
        name_of_father_mother: "Prafulla Reang",
        address: "House No. 45, Tairbhuma",
        village: "Tairbhuma",
        gram_panchayat: "Kambara Gram Panchayat",
        tehsil_taluka: "Ambassa",
        district: "Dhalai",
        scheduled_tribe: "Yes",
        other_traditional_forest_dweller: "No",
        name_of_other_family_members: [
          { name: "Arun Reang", age: 8 }
        ]
      },
      nature_of_claim_on_land: {
        extent_of_forest_land_occupied: {
          for_habitation: "0.2 acres",
          for_self_cultivation: "1.5 acres"
        },
        disputed_lands_if_any: "None",
        pattas_leases_grants_if_any: "FRA Land Title for 1.7 acres (vested)",
        land_for_in_situ_rehabilitation_or_alternative_land_if_any: "Not applicable",
        land_from_where_displaced_without_land_compensation: "Not applicable",
        extent_of_land_in_forest_villages_if_any: "1.7 acres",
        any_other_traditional_right_if_any: "Right to collect minor forest produce (MFP) for sustenance.",
        evidence_in_support: "Gram Sabha Resolution, FRA Land Title document, Aadhaar Card, ST Certificate, and bank account details for direct benefit transfer.",
        any_other_information: "The Tairbhuma village is on the JJM priority list and has met all the requirements for water infrastructure. The claimant, Dipali Reang, is an eligible landholding farmer for PM-KISAN. The household is not currently registered for MGNREGA."
      },
      schemes_eligibility: {
        jal_jeevan_mission: {
          qualifies: "Yes",
          reason: "The village is on the JJM priority list and has an FRA-recognized tribal population, which makes it a high priority for receiving Functional Household Tap Connections (FHTC)."
        },
        pm_kisan: {
          qualifies: "Yes",
          reason: "The claimant, Dipali Reang, is a tribal landholder with a valid FRA land title. Her Aadhaar and bank account are linked, fulfilling the requirements for income support."
        },
        mgnrega: {
          qualifies: "No",
          reason: "While the village is in a rural area, the claimant and her household are not currently registered with Job Cards, which is a prerequisite for participating in the scheme."
        }
      }
    };
  } else if (fileName === "village3.pdf") {
    return {
      claimant_information: {
        name_of_the_claimant: "Manik Jamatia",
        name_of_the_spouse: "Anita Jamatia",
        name_of_father_mother: "Sukumar Jamatia",
        address: "House No. 7, Dalak",
        village: "Dalak",
        gram_panchayat: "Sanamura Gram Panchayat",
        tehsil_taluka: "Bishalgarh",
        district: "Sepahijala",
        scheduled_tribe: "Yes",
        other_traditional_forest_dweller: "No",
        name_of_other_family_members: [
          { name: "Arjun Jamatia", age: 10 },
          { name: "Sonali Jamatia", age: 6 }
        ]
      },
      nature_of_claim_on_land: {
        extent_of_forest_land_occupied: {
          for_habitation: "0.15 acres",
          for_self_cultivation: "Not applicable"
        },
        disputed_lands_if_any: "None",
        pattas_leases_grants_if_any: "Not applicable",
        land_for_in_situ_rehabilitation_or_alternative_land_if_any: "Not applicable",
        land_from_where_displaced_without_land_compensation: "Not applicable",
        extent_of_land_in_forest_villages_if_any: "0.15 acres",
        any_other_traditional_right_if_any: "None",
        evidence_in_support: "Job Card under MGNREGA, Aadhaar Card, ST Certificate, and evidence of residence in a rural area.",
        any_other_information: "The claimant and their family are landless laborers residing in a forest habitation. The family is registered under MGNREGA and holds valid Job Cards."
      },
      schemes_eligibility: {
        jal_jeevan_mission: {
          qualifies: "No",
          reason: "The village is not currently listed in the JJM priority list and has not signed an MoU with the state for water infrastructure development."
        },
        pm_kisan: {
          qualifies: "No",
          reason: "The claimant is a landless laborer and does not own cultivable land with an FRA land title, which is a mandatory requirement for PM-KISAN eligibility."
        },
        mgnrega: {
          qualifies: "Yes",
          reason: "The claimant and their household are registered residents of a rural area with a valid Job Card. The village has high poverty and low development indicators, making it a priority area for MGNREGA work."
        }
      }
    };
  } else {
    return {
      claimant_information: {
        name_of_the_claimant: "Bimal Kalai",
        name_of_the_spouse: "Sumita Kalai",
        name_of_father_mother: "Debendra Kalai",
        address: "House No. 32, Paschim Daluma",
        village: "Paschim Daluma",
        gram_panchayat: "TTAADC Gram Panchayat",
        tehsil_taluka: "Jampuijala",
        district: "Sipahijala",
        scheduled_tribe: "Yes",
        other_traditional_forest_dweller: "No",
        name_of_other_family_members: [
          { name: "Arpita Kalai", age: 14 },
          { name: "Gita Kalai", age: 10 }
        ]
      },
      nature_of_claim_on_land: {
        extent_of_forest_land_occupied: {
          for_habitation: "0.1 acres",
          for_self_cultivation: "Not applicable"
        },
        disputed_lands_if_any: "None",
        pattas_leases_grants_if_any: "Not applicable",
        land_for_in_situ_rehabilitation_or_alternative_land_if_any: "Not applicable",
        land_from_where_displaced_without_land_compensation: "Not applicable",
        extent_of_land_in_forest_villages_if_any: "0.1 acres",
        any_other_traditional_right_if_any: "Right to collect minor forest produce (MFP) for personal use.",
        evidence_in_support: "Job Card under MGNREGA, Gram Sabha Resolution, Aadhaar Card, ST Certificate, and evidence of residence.",
        any_other_information: "The village is a part of the TTAADC (Tripura Tribal Areas Autonomous District Council) region, which is a priority area for development schemes. The family is landless but is an active participant in the MGNREGA scheme, which provides them with a source of income."
      },
      schemes_eligibility: {
        jal_jeevan_mission: {
          qualifies: "Yes",
          reason: "The village lacks Functional Household Tap Connections (FHTC), is listed in the JJM priority list for water infrastructure development, and being a tribal village, is prioritized for the scheme."
        },
        pm_kisan: {
          qualifies: "No",
          reason: "The claimant is a landless laborer and does not own cultivable land with an FRA land title, which is a mandatory requirement for PM-KISAN eligibility."
        },
        mgnrega: {
          qualifies: "Yes",
          reason: "The claimant and their household are registered residents of a rural area with a valid Job Card. The village has a high poverty rate and is a priority area for MGNREGA work, which provides them with guaranteed employment."
        }
      }
    };
  }
}

