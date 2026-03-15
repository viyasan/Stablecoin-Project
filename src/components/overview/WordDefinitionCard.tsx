export function WordDefinitionCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 hover:shadow-md transition-all relative overflow-hidden">
      {/* Corner ornaments */}
      <div className="absolute top-4 left-4 w-5 h-5 border-t-[1.5px] border-l-[1.5px] border-gold-500/50" />
      <div className="absolute top-4 right-4 w-5 h-5 border-t-[1.5px] border-r-[1.5px] border-gold-500/50" />
      <div className="absolute bottom-4 left-4 w-5 h-5 border-b-[1.5px] border-l-[1.5px] border-gold-500/50" />
      <div className="absolute bottom-4 right-4 w-5 h-5 border-b-[1.5px] border-r-[1.5px] border-gold-500/50" />

      <div className="px-6 py-8 sm:px-8 sm:py-8 md:px-10 md:py-10 text-center">
        {/* Word */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-chrome-900 mb-3 leading-none tracking-widest"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Stablecoin
        </h2>

        {/* Phonetic + Part of Speech */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-[15px] sm:text-[17px] italic font-light text-gold-500">
            STAY &middot; bul &middot; koyn
          </span>
          <div className="w-1 h-1 rounded-full bg-gold-500" />
          <span className="text-[12px] sm:text-[13px] uppercase tracking-[0.15em] font-medium text-gold-500">
            Noun
          </span>
        </div>

        {/* Gold gradient divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent mb-8" />

        {/* Definition */}
        <p
          className="text-base sm:text-lg leading-relaxed text-chrome-700"
        >
          A digital asset designed to <strong>maintain a stable value</strong>, typically pegged
          1:1 to a fiat currency (ex. US Dollar). Stablecoins offer{' '}
          <strong>price stability for payments, trading, and remittances</strong> using blockchain
          technology.
        </p>
      </div>
    </div>
  );
}
