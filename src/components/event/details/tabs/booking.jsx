"use client";
import { Button, Switch } from "antd";
import { CalendarOutlined, EditOutlined } from "@ant-design/icons";
export const BookingTab = () => {
  return (
    <>
      <div className="sw-details-content">
        <section className="sw-details-card">
          <div className="sw-details-card-header">
            <div>
              <h2>Booking</h2>
              <p>Booking and reservation configuration</p>
            </div>

            <Button
              type="text"
              icon={<EditOutlined />}
              className="sw-details-card-action"
            >
              Edit
            </Button>
          </div>

          <div className="sw-details-booking">
            <div className="sw-details-booking-status">
              <div className="sw-details-booking-icon">
                <CalendarOutlined />
              </div>

              <div>
                <strong>Booking is enabled</strong>

                <span>
                  Visitors can reserve their attendance for this listing.
                </span>
              </div>

              <Switch defaultChecked />
            </div>

            <div className="sw-details-booking-grid">
              <div>
                <span>Booking Type</span>
                <strong>Online Reservation</strong>
              </div>

              <div>
                <span>Capacity</span>
                <strong>500 people</strong>
              </div>

              <div>
                <span>Available Seats</span>
                <strong>326</strong>
              </div>

              <div>
                <span>Booked</span>
                <strong>174</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
