import React from "react";

import "./Timeline.scss";

const Timeline = () => (
  <>
    <DevelopmentTimeline />
  </>
);

const DevelopmentTimeline = () =>
  timelineData.length > 0 && (
    <div className="timeline-container">
      {timelineData.map((data, idx) => (
        <TimelineItem data={data} key={idx} />
      ))}
    </div>
  );

const timelineData = [
  {
    text: "Implement SSO login",
    date: "12/08/2020",
    category: {
      tag: "future planned update",
      color: "#F27719",
    },
    issues: "",
    status: "waiting",
    release: "1.9",
    priority: {
      priority_text: "P0",
      priority_color: "#FF0000",
    },
    link: {
      url: "mailto:alexandru.bran@nokia.com",
      text: "contact developer",
    },
  },
  {
    text: "Update/Review BIG Scheduler",
    date: "12/07/2020",
    category: {
      tag: "future planned update",
      color: "#F27719",
    },
    issues: "",
    status: "researching",
    release: "1.8",
    priority: {
      priority_text: "P1",
      priority_color: "#018f69",
    },
    link: {
      url: "mailto:alexandru.bran@nokia.com",
      text: "contact developer",
    },
  },
  {
    text: "Add feature for updating by L1 and L2 approved requests",
    date: "12/06/2020",
    category: {
      tag: "future planned update",
      color: "#F27719",
    },
    issues: "",
    release: "1.7",
    status: "Waiting",
    priority: {
      priority_text: "P2",
      priority_color: "#018f69",
    },
    link: {
      url: "mailto:alexandru.bran@nokia.com",
      text: "contact developer",
    },
  },
  {
    text: "Add name instead of created by in approval",
    date: "12/05/2020",
    category: {
      tag: "future planned update",
      color: "#F27719",
    },
    issues: "",
    status: "In progress",
    release: "1.6.2",
    priority: {
      priority_text: "P2",
      priority_color: "#018f69",
    },
    link: {
      url: "mailto:alexandru.bran@nokia.com.com",
      text: "contact developer",
    },
  },
  {
    text: "Review EMAIL handler to work on delete API/without TPM/LM",
    date: "30/04/2020",
    category: {
      tag: "future planned update",
      color: "#F27719",
    },
    release: "1.6.1",
    priority: {
      priority_text: "P0",
      priority_color: "#018f69",
    },
    status: "95%",
    link: {
      url: "mailto:alexandru.bran@nokia.com",
      text: "contact developer",
    },
  },
  {
    text: "Update event form",
    date: "30/03/2020",
    category: {
      tag: "future planned update",
      color: "#018f69",
    },
    issues: "",
    status: "50%",
    release: "1.6",
    priority: {
      priority_text: "P2",
      priority_color: "#018f69",
    },
    link: {
      url: "mailto:alexandru.bran@nokia.com",
      text: "contact developer",
    },
  },
  {
    text: "Add filter for engineer in Schedule page",
    date: "14/05/2020",
    category: {
      tag: "implemented",
      color: "#018f69",
    },
    issues: "",
    status: "ok",
    release: "1.5",
    priority: {
      priority_text: "P3",
      priority_color: "#018f69",
    },
    link: {
      url: "mailto:alexandru.bran@nokia.com.com",
      text: "contact developer",
    },
  },
  {
    text: "Migrate from MySQL to MSSQL",
    date: "13/05/2020",
    category: {
      tag: "implemented",
      color: "#018f69",
    },
    issues: "app strange behaviour after test implementation",
    status: "ok",
    release: "1.4",
    priority: {
      priority_text: "P1",
      priority_color: "#018f69",
    },
    link: {
      url: "mailto:alexandru.bran@nokia.com",
      text: "contact developer",
    },
  },
  {
    text: "Update event form",
    date: "30/03/2020",
    category: {
      tag: "future planned update",
      color: "#018f69",
    },
    issues: "",
    status: "temp implementation",
    release: "1.3",
    priority: {
      priority_text: "P2",
      priority_color: "#018f69",
    },
    link: {
      url: "mailto:alexandru.bran@nokia.com",
      text: "contact developer",
    },
  },
  {
    text: "Event add status review",
    date: "18/03/2020",
    release: "1.2",
    category: {
      tag: "IMPLEMENTED",
      color: "#018f69",
    },
    status: "ok",
    priority: {
      priority_text: "P1",
      priority_color: "#018f69",
    },
    link: {
      url: "mailto:alexandru.bran@nokia.com",
      text: "contact developer",
    },
  },
  {
    text: "DNS implementation",
    date: "01/03/2020",
    release: "1.1",
    priority: {
      priority_text: "P1",
      priority_color: "#018f69",
    },
    category: {
      tag: "IMPLEMENTED",
      color: "#018f69",
    },
    status: "ok",
    link: {
      url: "mailto:alexandru.bran@nokia.com",
      text: "contact developer",
    },
  },
];

const TimelineItem = ({ data }) => (
  <div className="timeline-item">
    <div className="timeline-item-content">
      <span className="tag" style={{ background: data.category.color }}>
        {data.release} {data.category.tag}
      </span>
      <time>{data.date}</time>
      <p>{data.text}</p>
      <span
        className="priority"
        style={{ color: data.priority.priority_color }}
      >
        {data.priority.priority_text} - {data.status}
      </span>
      {data.link && (
        <a href={data.link.url} target="_blank" rel="noopener noreferrer">
          {data.link.text}
        </a>
      )}
      <span className="circle" />
    </div>
  </div>
);


export default Timeline