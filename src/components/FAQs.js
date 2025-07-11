import React, { useState } from 'react';

const faqs = [
  { question: "What is Vipreshana?", answer: "Vipreshana is an open source project..." },
  { question: "How do I contribute?", answer: "Fork the repo and submit PRs." },
  { question: "What is SSoC?", answer: "Script Summer of Code..." }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Frequently Asked Questions</h2>
      <input
        type="text"
        placeholder="Search FAQs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "20px" }}
      />
      <ul>
        {filteredFaqs.map((faq, index) => (
          <li key={index} style={{ marginBottom: "15px" }}>
            <strong>{faq.question}</strong>
            <p>{faq.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}