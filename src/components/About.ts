// About Meセクション
export function renderAbout(): string {
  return `
    <section class="max-w-4xl mx-auto mb-16">
      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div class="flex justify-center mb-8">
          <img
            src="/icon.png"
            alt="Profile Icon"
            class="w-24 h-24 rounded-full shadow-lg"
          />
        </div>

        <div class="prose prose-lg mx-auto text-gray-700 leading-relaxed">
          <p class="mb-3">こんにちは！</p>
          <p class="mb-3">
            Webエンジニアとして開発しつつ、ちょっとマネジメントもやってます。
            PythonとReactを中心に、フロントからインフラ(AWS)まで触ってます。
            新しい技術を試すのが好きです。
          </p>
          <p>
            1987年生まれ、茨城県出身、岐阜県在住。麻雀が好き。
          </p>
        </div>
      </div>
    </section>
  `;
}
