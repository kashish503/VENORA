
# VENORA MVP UI/UX Review and Test Cases

## 1. Purpose

This document reviews the user interface flow for the VENORA MVP and defines test cases for registration, login, requirement submission, and AI-based supplier matching.

The test cases are prepared for the first working prototype. Actual execution will be performed after the frontend and backend APIs are integrated.

## 2. UI/UX Flow Review

The expected user flow is:

**Vendor Flow:**

Register/Login → Vendor Dashboard → Create Requirement → Enter Requirement Details → Submit Requirement → View Top 3 Supplier Matches

**Supplier Flow:**

Register/Login → Supplier Dashboard → Manage Supplier Profile

## 3. UI/UX Review Checklist

| ID | Review Item | Expected Design | Status |
|---|---|---|---|
| UI-01 | Login Page | Email and password fields with a Login button | To Review |
| UI-02 | Registration Page | Name, email, password, and Vendor/Supplier role selection | To Review |
| UI-03 | Role Selection | Vendor and Supplier options are clearly distinguishable | To Review |
| UI-04 | Vendor Dashboard | A clear option to create a procurement requirement | To Review |
| UI-05 | Requirement Form | Industry, material, quantity, budget, city, and state fields | To Review |
| UI-06 | Form Validation | Required fields and invalid values show helpful messages | To Review |
| UI-07 | Matching Results | Up to three suitable suppliers are shown when available | To Review |
| UI-08 | Supplier Information | Price, quality rating, delivery time, and location are visible | To Review |
| UI-09 | Compatibility Score | A score is clearly labelled and consistently displayed | To Review |
| UI-10 | Navigation and Feedback | Users receive clear success, loading, and error messages | To Review |

**Review note:** Mark an item as Pass or Needs Fix after checking the actual interface. Do not mark items as passed before reviewing the working prototype.

## 4. Test Cases

The following test cases will be executed after the relevant frontend and backend APIs are available.

| Test Case ID | Feature | Test Steps / Input | Expected Result | Status |
|---|---|---|---|---|
| TC-01 | Vendor Registration | Register with a valid name, email, password, and Vendor role | Account is created successfully with the Vendor role | Not Run |
| TC-02 | Supplier Registration | Register with valid details and Supplier role | Account is created successfully with the Supplier role | Not Run |
| TC-03 | Missing Registration Fields | Submit registration with a required field empty | Validation message is displayed and invalid registration is rejected | Not Run |
| TC-04 | Duplicate Email | Register using an email that already exists | Duplicate account is rejected with a clear message | Not Run |
| TC-05 | Valid Login | Login using valid registered credentials | User is authenticated and directed to the appropriate dashboard | Not Run |
| TC-06 | Invalid Login | Login with an incorrect password | Login is rejected and an appropriate error message appears | Not Run |
| TC-07 | Role-Based Access | Login as a Vendor and inspect the available dashboard | Vendor-specific features are displayed | Not Run |
| TC-08 | Requirement Submission | Submit a valid industry, material, quantity, budget, and location | Requirement is accepted and saved successfully | Not Run |
| TC-09 | Missing Requirement Fields | Submit a requirement with a required field missing | Submission is rejected with a useful validation message | Not Run |
| TC-10 | Invalid Quantity | Submit a quantity of zero or a negative quantity | Invalid quantity is rejected | Not Run |
| TC-11 | Invalid Budget | Submit a negative budget | Invalid budget is rejected | Not Run |
| TC-12 | Matching Results | Submit a valid requirement for which suitable suppliers exist | Matching results are returned and displayed | Not Run |
| TC-13 | Top Three Suppliers | Submit a requirement with at least three eligible suppliers | Up to three suitable suppliers are displayed in ranked order | Not Run |
| TC-14 | Supplier Details | Inspect the matching results | Each displayed supplier shows price, quality rating, delivery time, and location | Not Run |
| TC-15 | Budget Compatibility | Compare supplier estimated cost against the vendor's total budget | Supplier costs and budget compatibility are displayed or handled according to the agreed matching rules | Not Run |
| TC-16 | No Suitable Suppliers | Submit a requirement for which no eligible suppliers exist | A clear no-matches message is displayed | Not Run |
| TC-17 | Matching Score | Inspect the compatibility score for returned suppliers | A valid score is displayed using the agreed scoring format | Not Run |
| TC-18 | Backend/API Error | Simulate or encounter a failed request | A helpful error message is displayed without crashing the interface | Not Run |

## 5. Sample Requirement for Testing

| Field | Sample Value |
|---|---|
| Industry | Steel |
| Material | Mild steel rod |
| Quantity | 100 kg |
| Total Budget | ₹8,000 |
| Location | Faridabad, Haryana |

Using the sample supplier data, Aarav Steel Traders offers mild steel rods at an illustrative price of ₹72 per kg.

Estimated total cost = 100 × ₹72 = ₹7,200.

The estimated cost is within the sample budget of ₹8,000. The actual matching result and rank must be verified against the implemented backend logic.

## 6. Testing Execution Notes

- Keep all test cases marked Not Run until they have actually been executed.
- Record Pass or Fail after each test and add the observed result when a test fails.
- Coordinate with the backend developer to obtain the actual API endpoints, request fields, response fields, and authentication requirements.
- Use Postman for API-level testing when the APIs are available.
- Test the integrated frontend separately to confirm that the results and error messages appear correctly.
- Use only fictional test accounts and sample supplier data for the demonstration.

## 7. Current MVP Scope

The current prototype focuses on registration, login, vendor requirement submission, and AI-based supplier matching.

Shipment tracking, order confirmation, and delivery tracking are outside the current MVP scope.
