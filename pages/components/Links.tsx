import { useId } from "react";
import { socialLinks } from "../config/social";

// リンクセクション(SNS + Scrapbox)
interface LinksProps {
  scrapboxContent: React.ReactNode;
}

export function Links({ scrapboxContent }: LinksProps) {
  const scrapboxContentId = useId();
  return (
    <section className="max-w-4xl mx-auto mb-16">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          Links
        </h2>

        {/* SNS Links */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Social Media
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer me"
                className={`social-link ${social.bgColor} ${social.hoverColor} text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg`}
              >
                <iconify-icon icon={social.icon} width="20" height="20" />
                {social.name}
              </a>
            ))}
          </div>
        </div>

        {/* Scrapbox Section */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Recent Notes from Scrapbox
          </h3>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <div id={scrapboxContentId}>{scrapboxContent}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
