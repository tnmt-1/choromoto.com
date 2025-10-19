// About Meセクション
export function About() {
  return (
    <section className="max-w-4xl mx-auto mb-16">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex justify-center mb-8">
          <img
            src="/icon.png"
            alt="Profile Icon"
            className="w-24 h-24 rounded-full shadow-lg"
          />
        </div>

        <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
          <p className="mb-3">こんにちは!</p>
          <p className="mb-3">
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
  );
}
