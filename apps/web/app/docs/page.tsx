import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { docsLanding as t } from "@/texts";

export default function DocsPage() {
  return (
    <div>
      <h1>{t.heading}</h1>
      <p>{t.subheading}</p>

      <div className="grid sm:grid-cols-2 gap-4 mt-8 not-prose">
        {t.cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="glass rounded-xl p-5 border border-surface-800/50 card-gradient-hover group"
          >
            <h3 className="text-base font-semibold text-surface-100 mb-1.5 group-hover:text-awesome-300 transition-colors">
              {card.title}
            </h3>
            <p className="text-sm text-surface-400">{card.desc}</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-awesome-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {t.viewDocs} <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
