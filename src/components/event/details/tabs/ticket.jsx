"use client";
import { Button } from "antd";
import { PlusOutlined, EditOutlined, TagsOutlined } from "@ant-design/icons";

export const TicketsTab = () => {
  return (
    <>
      <div className="sw-details-content">
        <section className="sw-details-card">
          <div className="sw-details-card-header">
            <div>
              <h2>Tickets</h2>
              <p>Ticket types and pricing</p>
            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="sw-details-save-action"
            >
              Add Ticket
            </Button>
          </div>

          <div className="sw-details-ticket-list">
            <div className="sw-details-ticket">
              <div className="sw-details-ticket-icon">
                <TagsOutlined />
              </div>

              <div className="sw-details-ticket-content">
                <strong>Regular Ticket</strong>

                <span>General admission</span>
              </div>

              <div className="sw-details-ticket-price">
                <span>Price</span>
                <strong>TZS 50,000</strong>
              </div>

              <div className="sw-details-ticket-capacity">
                <span>Available</span>
                <strong>326</strong>
              </div>

              <Button
                type="text"
                icon={<EditOutlined />}
                className="sw-details-ticket-action"
              />
            </div>

            <div className="sw-details-ticket">
              <div className="sw-details-ticket-icon">
                <TagsOutlined />
              </div>

              <div className="sw-details-ticket-content">
                <strong>VIP Ticket</strong>

                <span>Premium access</span>
              </div>

              <div className="sw-details-ticket-price">
                <span>Price</span>
                <strong>TZS 150,000</strong>
              </div>

              <div className="sw-details-ticket-capacity">
                <span>Available</span>
                <strong>45</strong>
              </div>

              <Button
                type="text"
                icon={<EditOutlined />}
                className="sw-details-ticket-action"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
