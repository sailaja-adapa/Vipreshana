import React, { useState } from 'react';
import './FAQs.css';
//faq data
const faqData = [
    {
        question: 'What is Vipreshana?',
        answer: 'Vipreshana is a smart logistics platform that connects users with verified drivers for safe and efficient goods transportation. We offer real-time tracking, live updates, and reliable service you can trust.',
    },
    {
        question: 'How do I book a shipment?',
        answer: 'Register or log in, enter your pickup and drop-off locations, choose your vehicle type, and confirm your shipment request. It is quick, easy and hassle-free.',
    },
    {
        question: 'Can I track my shipment in real time?',
        answer: 'Yes, you will get real-time tracking updates for every shipment through your dashboard.',
    },
    {
        question: 'How are drivers assigned?',
        answer: 'Our system automatically assigns the nearest available verified driver to your pickup location to ensure fast and efficient delivery.',
    },
    {
        question: 'What payment methods are accepted?',
        answer: 'We accept all major credit/debit cards, PayPal, and corporate billing for verified businesses.',
    },
    {
        question: 'Is Vipreshana free to use? Are there any premium plans?',
        answer: 'Vipreshana is entirely free to use for booking and tracking shipments. We do not offer premium plans, all users have full access to our features without any subscription fees. You only pay for the delivery services you use.',
    },
];

const FAQSection = ({ isDark }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className={`faq-section ${isDark ? 'dark' : ''}`}>
            <h3>Frequently Asked Questions</h3>
            {faqData.map((item, index) => (
                <div
                    key={index}
                    className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                >
                    <div
                        className="faq-question"
                        onClick={() => toggleFAQ(index)}
                    >
                        {item.question}
                        <span>{activeIndex === index ? '-' : '+'}</span>
                    </div>
                    <div className="faq-answer">
                        <p>{item.answer}</p>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default FAQSection;
