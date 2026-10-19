import { Typography } from 'antd';

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <Typography.Title level={2}>About Sahand Estate</Typography.Title>
      <Typography.Paragraph className="text-base!">
        Sahand Estate is a leading real estate agency that specializes in
        helping clients buy, sell, and rent properties in the most desirable
        neighborhoods. Our team of experienced agents is dedicated to providing
        exceptional service and making the buying and selling process as smooth
        as possible.
      </Typography.Paragraph>
      <Typography.Paragraph className="text-base!">
        Our mission is to help our clients achieve their real estate goals by
        providing expert advice, personalized service, and a deep understanding
        of the local market. Whether you are looking to buy, sell, or rent a
        property, we are here to help you every step of the way.
      </Typography.Paragraph>
      <Typography.Paragraph className="text-base!">
        Our team of agents has a wealth of experience and knowledge in the real
        estate industry, and we are committed to providing the highest level of
        service to our clients. We believe that buying or selling a property
        should be an exciting and rewarding experience, and we are dedicated to
        making that a reality for each and every one of our clients.
      </Typography.Paragraph>
    </div>
  );
}
