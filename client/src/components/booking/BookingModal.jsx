import { useState } from 'react';
import { App, Button, DatePicker, Form, Input, Modal } from 'antd';
import { createBooking } from '@/api/booking.api';

export default function BookingModal({ listing, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await createBooking({
        listingId: listing._id,
        ...values,
        date: values.date.toISOString(),
      });
      message.success('Viewing request sent! The landlord will confirm soon.');
      setOpen(false);
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={handleOpen} className="w-fit!">
        Book a viewing
      </Button>
      <Modal
        title={`Book a viewing - ${listing.name}`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Your name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input placeholder="email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter your phone' }]}
          >
            <Input placeholder="phone" />
          </Form.Item>
          <Form.Item
            name="date"
            label="Preferred date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker showTime className="w-full!" />
          </Form.Item>
          <Form.Item name="message" label="Message">
            <Input.TextArea rows={3} placeholder="Anything the landlord should know" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Send request
          </Button>
        </Form>
      </Modal>
    </>
  );
}
