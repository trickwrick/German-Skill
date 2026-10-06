import Image from "next/image";
import { getGatewayData } from "../../lib/gatewayStore";

export default async function GatewaySection() {
  const data = await getGatewayData();

  return (
    <section className="gateway-section">
      <div className="gateway-container">
        <div className="gateway-content">
          <h2>{data.heading}</h2>
          <p className="gateway-subtitle">{data.subtitle}</p>
          <p className="gateway-description">{data.description}</p>
          
          <div className="gateway-steps">
            <h3>{data.stepsHeading}</h3>
            
            {data.steps.map((step, index) => (
              <div key={index} className="gateway-step">
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="gateway-image-wrapper">
          <Image
            src={data.imageSrc}
            alt="German language training session"
            width={600}
            height={800}
            className="gateway-image"
          />
        </div>
      </div>
    </section>
  );
}
