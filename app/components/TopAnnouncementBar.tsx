const announcements = [
  {
    text: "Trusted by",
    highlight: "16,500+",
    rest: "students learning German with us",
  },
  {
    text: "German Made Easy — Learn Anytime, Anywhere",
  },
  {
    text: "A1–C2 Goethe Certified Live Online Classes",
  },
  {
    text: "Book Your",
    highlight: "Free Demo",
    rest: "Class Today",
  },
  {
    text: "Flexible Batches | Expert Tutors | Study Material Included",
  },
];

function AnnouncementItems() {
  return (
    <>
      {announcements.map((item, index) => (
        <span key={`${item.text}-${index}`} className="top-announcement-item">
          {item.text}
          {item.highlight ? (
            <span className="top-announcement-badge">{item.highlight}</span>
          ) : null}
          {item.rest ? ` ${item.rest}` : ""}
        </span>
      ))}
    </>
  );
}

export default function TopAnnouncementBar() {
  return (
    <div className="top-announcement-bar" aria-label="Site announcements">
      <div className="top-announcement-track">
        <div className="top-announcement-content">
          <AnnouncementItems />
        </div>
        <div className="top-announcement-content" aria-hidden="true">
          <AnnouncementItems />
        </div>
      </div>
    </div>
  );
}
