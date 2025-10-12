// リンクセクション（SNS + Scrapbox）
import { socialLinks } from "../config/social";

export function renderLinks(scrapboxContent: string): string {
  // SNSリンクのHTMLを生成（Iconifyを使用）
  const socialLinksHTML = socialLinks
    .map(
      (social) => `
      <a href="${social.url}" target="_blank" rel="noopener noreferrer me"
         class="social-link ${social.bgColor} ${social.hoverColor} text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
        <iconify-icon icon="${social.icon}" width="20" height="20"></iconify-icon>
        ${social.name}
      </a>
    `,
    )
    .join("");

  return `
    <section class="max-w-4xl mx-auto mb-16">
      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          Links
        </h2>

        <!-- SNS Links -->
        <div class="mb-12">
          <h3 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Social Media</h3>
          <div class="flex flex-wrap justify-center gap-6">
            ${socialLinksHTML}
          </div>
        </div>

        <!-- Scrapbox Section -->
        <div>
          <h3 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Recent Notes from Scrapbox</h3>
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <div id="scrapbox-content">
              ${scrapboxContent}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
