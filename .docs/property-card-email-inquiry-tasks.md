# Feature: Property Card Email Inquiry

## Overview
When a user clicks the **Email** button on a property card, a popup/modal should open. After the user fills in the details and clicks **Send**, a lead should be created.

Since the email service is currently down, do not integrate the email API yet. Instead, simulate the email flow with console logs.

---

## Task 1: Open Email Popup
- Add an **Email** button on the property card (if not already present).
- When the user clicks the button, open an email inquiry popup/modal.

---

## Task 2: Submit Inquiry
- Add a **Send** button inside the popup.
- Validate the required fields before submission.

---

## Task 3: Create Lead
- On successful submission, create a lead using the existing service:

```ts
createLead()
```

- Pass all required lead information to the service.

---

## Task 4: Mock Email Sending
The actual email service is currently unavailable.

For now:
- Do **not** call any email API.
- Simulate the email sending process by adding console logs from the service layer.

Example:

```ts
console.log('Email would be sent to the property agent and the user.');
console.log('Payload:', payload);
```

Later, this will be replaced with the actual email API integration.

---

## Task 5: Show Success Toast
- After the lead is created successfully, display a success toast notification.
- Use the existing **Shared Toaster** component.
- Refer to the **Save Search** feature implementation as an example of how to show toast messages.

Example message:

```text
Your inquiry has been submitted successfully.
```

---

## Expected Flow

1. User clicks **Email** on the property card.
2. Email inquiry popup opens.
3. User fills in the form and clicks **Send**.
4. `createLead()` is called.
5. Mock email sending is logged to the console.
6. A success toast is displayed to the user.

---

## Future Enhancement

Once the email service is available:

- Send an email to the **property agent**.
- Send a confirmation email to the **user**.
- Replace the console logs with the actual `sendEmail` API integration.
