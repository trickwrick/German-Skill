"use client";

import { useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { shortLabelCountries } from "../../../data/shortLabelCountries";

export default function PhoneField() {
  const [phone, setPhone] = useState("+91");

  return (
    <div className="contact-field contact-intl-field">
      <span>Phone Number *</span>
      <input type="hidden" name="phone" value={phone} />
      <div className="contact-intl-phone">
        <PhoneInput
          defaultCountry="in"
          value={phone}
          onChange={(value) => setPhone(value)}
          countries={shortLabelCountries}
          forceDialCode
          preferredCountries={["in", "de", "ae", "us", "gb", "ca", "au", "np", "bd", "sg"]}
          placeholder="977 320 1465"
          required
        />
      </div>
    </div>
  );
}
