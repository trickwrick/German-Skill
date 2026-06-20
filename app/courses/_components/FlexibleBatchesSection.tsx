"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { CourseFlexibleBatches } from "../../../data/courseFlexibleBatches";
import CourseEnrollModal from "./CourseEnrollModal";

type FlexibleBatchesSectionProps = {
  batchesContent: CourseFlexibleBatches;
  salePrice: string;
  courseSlug: string;
  courseTitle: string;
};

function parsePriceValue(price: string) {
  const numeric = Number(price.replace(/[^\d.]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
}

function formatInr(value: number) {
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function HourglassIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 2h8v5.2L12 11l4 3.8V22H8v-7.2L12 11 8 7.2V2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 6h6M9 18h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 11V8a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function parseOfferEndDate(value?: string) {
  if (!value) {
    const end = new Date();
    end.setDate(end.getDate() + 15);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    const end = new Date();
    end.setDate(end.getDate() + 15);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  return parsed;
}

function getCountdownParts(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function getDefaultBatchId(batches: CourseFlexibleBatches["batches"]) {
  const explicitDefault = batches.find((batch) => batch.defaultSelected && !batch.soldOut);
  if (explicitDefault) {
    return explicitDefault.id;
  }

  return batches.find((batch) => !batch.soldOut)?.id ?? batches[0]?.id ?? "";
}

export default function FlexibleBatchesSection({
  batchesContent,
  salePrice,
  courseSlug,
  courseTitle,
}: FlexibleBatchesSectionProps) {
  const defaultBatchId = getDefaultBatchId(batchesContent.batches);

  const [selectedBatchId, setSelectedBatchId] = useState(defaultBatchId);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [offerEnd] = useState(() => parseOfferEndDate(batchesContent.offerEndsAt));
  const [countdown, setCountdown] = useState(getCountdownParts(offerEnd));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdownParts(offerEnd));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [offerEnd]);

  const pricing = useMemo(() => {
    const saleValue = parsePriceValue(salePrice);
    const originalValue =
      parsePriceValue(batchesContent.originalPrice) || saleValue * 2 || saleValue;
    const savings = Math.max(originalValue - saleValue, 0);

    return {
      original: batchesContent.originalPrice || formatInr(originalValue),
      sale: salePrice,
      savings: formatInr(savings),
      discount: batchesContent.discountPercent,
    };
  }, [batchesContent.discountPercent, batchesContent.originalPrice, salePrice]);

  return (
    <section className="flexible-batches-section">
      <div className="flexible-batches-inner">
        <p className="flexible-batches-subtitle">
          {batchesContent.subtitle}{" "}
          <span className="flexible-batches-highlight">{batchesContent.highlight}</span>
        </p>
        <h2 className="flexible-batches-title">{batchesContent.title}</h2>

        <div className="flexible-batches-card">
          <div className="flexible-batches-list" role="radiogroup" aria-label="Choose a batch">
            {batchesContent.batches.map((batch, index) => {
              const isSelected = selectedBatchId === batch.id;
              const isSoldOut = Boolean(batch.soldOut);

              return (
                <label
                  key={batch.id}
                  className={`flexible-batch-row${isSelected ? " is-selected" : ""}${
                    isSoldOut ? " is-sold-out" : ""
                  }${index === 0 ? " is-first" : ""}`}
                >
                  <input
                    type="radio"
                    name={`batch-${courseSlug}`}
                    value={batch.id}
                    checked={isSelected}
                    disabled={isSoldOut}
                    onChange={() => setSelectedBatchId(batch.id)}
                  />

                  {isSoldOut ? (
                    <span className="flexible-batch-soldout">SOLD OUT</span>
                  ) : (
                    <span className="flexible-batch-radio" aria-hidden="true" />
                  )}

                  <strong className="flexible-batch-date">{batch.date}</strong>
                  <span className="flexible-batch-tag">{batch.dayType}</span>
                  <span className="flexible-batch-schedule">{batch.schedule}</span>
                  <span className="flexible-batch-time">{batch.time}</span>
                </label>
              );
            })}
          </div>

          <aside className="flexible-batches-pricing">
            <div className="flexible-batches-price-row">
              <span className="flexible-batches-price-label">
                Price <s>{pricing.original}</s>
              </span>
              <strong className="flexible-batches-price-value">{pricing.sale}</strong>
              <span className="flexible-batches-price-off">
                {pricing.discount}% OFF, Save {pricing.savings}.
              </span>
            </div>

            <div className="flexible-batches-timer">
              <HourglassIcon />
              <span>
                Ends in {countdown.days}d : {countdown.hours}h : {countdown.minutes}m :{" "}
                {countdown.seconds}s
              </span>
            </div>

            <div className="flexible-batches-badge">{batchesContent.badge}</div>

            <button
              type="button"
              className="flexible-batches-enroll-btn"
              onClick={() => setEnrollOpen(true)}
            >
              ENROLL NOW
            </button>

            <div className="flexible-batches-secure">
              <LockIcon />
              <span>Secure Transaction</span>
              <Image
                src="/images/secure-payment-icons.png"
                alt="Accepted payment methods"
                width={90}
                height={24}
                className="flexible-batches-payment-icons"
              />
            </div>
          </aside>
        </div>
      </div>

      <CourseEnrollModal
        open={enrollOpen}
        courseSlug={courseSlug}
        courseTitle={courseTitle}
        onClose={() => setEnrollOpen(false)}
      />
    </section>
  );
}
