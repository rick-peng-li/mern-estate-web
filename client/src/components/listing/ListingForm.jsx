import { useState } from 'react';
import { App, Button, Checkbox, Col, Form, Input, InputNumber, Radio, Row, Spin, Upload } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { uploadImageToFirebase } from '@/utils/uploadImage';

const MAX_IMAGES = 6;

export default function ListingForm({
  initialValues,
  submitLabel,
  submitting,
  onSubmit,
}) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState(initialValues?.imageUrls || []);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const offer = Form.useWatch('offer', form) ?? initialValues?.offer ?? false;

  const handleUpload = async () => {
    if (fileList.length === 0) return;
    if (fileList.length + imageUrls.length > MAX_IMAGES) {
      message.error(`You can only upload ${MAX_IMAGES} images per listing`);
      return;
    }
    setUploading(true);
    try {
      const urls = await Promise.all(
        fileList.map((file) => uploadImageToFirebase(file.originFileObj))
      );
      setImageUrls((prev) => [...prev, ...urls]);
      setFileList([]);
    } catch (error) {
      message.error('Image upload failed (2 MB max per image)');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFinish = (values) => {
    if (imageUrls.length < 1) {
      message.error('You must upload at least one image');
      return;
    }
    if (+values.regularPrice < +values.discountPrice) {
      message.error('Discount price must be lower than regular price');
      return;
    }
    onSubmit({ ...values, imageUrls });
  };

  return (
    <Spin spinning={false}>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: 'Please enter the name' },
                { min: 10, message: 'Name must be at least 10 characters' },
                { max: 62, message: 'Name must be less than 62 characters' },
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter the description' }]}
            >
              <Input.TextArea rows={4} placeholder="Description" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please enter the address' }]}
            >
              <Input placeholder="Address" />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Radio.Group optionType="button" buttonStyle="solid">
                <Radio.Button value="sale">Sell</Radio.Button>
                <Radio.Button value="rent">Rent</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="parking" valuePropName="checked" label="Parking">
                  <Checkbox>Parking spot</Checkbox>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="furnished" valuePropName="checked" label="Furnished">
                  <Checkbox>Furnished</Checkbox>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="offer" valuePropName="checked" label="Offer">
                  <Checkbox>Offer</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="bedrooms" label="Beds" rules={[{ required: true }]}>
                  <InputNumber min={1} max={10} className="w-full!" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="bathrooms" label="Baths" rules={[{ required: true }]}>
                  <InputNumber min={1} max={10} className="w-full!" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="regularPrice"
                  label="Regular price"
                  rules={[{ required: true, message: 'Please enter the regular price' }]}
                >
                  <InputNumber
                    min={50}
                    max={10000000}
                    className="w-full!"
                    prefix="$"
                  />
                </Form.Item>
              </Col>
              {offer && (
                <Col span={6}>
                  <Form.Item
                    name="discountPrice"
                    label="Discounted price"
                    rules={[{ required: true, message: 'Please enter the discounted price' }]}
                  >
                    <InputNumber
                      min={0}
                      max={10000000}
                      className="w-full!"
                      prefix="$"
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Col>
          <Col xs={24} lg={12}>
            <p className="mb-2 font-semibold">
              Images:
              <span className="ml-2 font-normal text-gray-500">
                The first image will be the cover (max {MAX_IMAGES})
              </span>
            </p>
            <div className="flex gap-3">
              <Upload
                listType="picture-card"
                fileList={fileList}
                accept="image/*"
                multiple
                beforeUpload={() => false}
                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              >
                <div>
                  <PlusOutlined />
                  <div className="mt-2 text-sm">Select</div>
                </div>
              </Upload>
              <Button
                type="default"
                loading={uploading}
                onClick={handleUpload}
                className="self-start"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            {imageUrls.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="relative overflow-hidden rounded-lg border border-gray-200"
                  >
                    <img
                      src={url}
                      alt={`listing-${index}`}
                      className="h-24 w-24 object-cover"
                    />
                    <Button
                      type="primary"
                      danger
                      size="small"
                      shape="circle"
                      icon={<DeleteOutlined />}
                      className="absolute top-1 right-1"
                      onClick={() => handleRemoveImage(index)}
                    />
                  </div>
                ))}
              </div>
            )}
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={submitting}
              disabled={uploading}
              className="mt-6"
            >
              {submitLabel}
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
}
