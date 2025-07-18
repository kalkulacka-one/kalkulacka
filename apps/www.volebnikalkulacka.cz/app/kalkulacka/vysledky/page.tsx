import { Button } from "@repo/design-system/client";
import Link from "next/link";
import { Content } from "./components/content";
import { Header } from "./components/header";
import { ResultCandidateCard } from "./components/resultCard";
import data from "./data.json";

export default function Page() {
  return (
    <div>
      <Header>
        <Link href="/kalkulacka/otazka">
          <Button variant="link" color="neutral">
            ←
          </Button>
        </Link>

        <Header.Title>Výsledky</Header.Title>
        <Header.Right>
          <Button variant="link">Sdílet</Button>
          <Button>Porovnat odpovědi</Button>
        </Header.Right>
      </Header>
      <Content>
        <div className="flex flex-col gap-4">
          {data.map((card, index) => (
            <ResultCandidateCard key={card.id}>
              <ResultCandidateCard.Circle>{card.id}</ResultCandidateCard.Circle>
              <ResultCandidateCard.ShortTitle>{card.coalition_short}</ResultCandidateCard.ShortTitle>
              <ResultCandidateCard.LongTitle>{card.coalition_long}</ResultCandidateCard.LongTitle>
              <ResultCandidateCard.Progress value={card.percentage} />
            </ResultCandidateCard>
          ))}
        </div>
      </Content>
      <Content>
        <div>
          Přidejte se do klubu podporovatelů Volební kalkulačky Podpořte Volební kalkulačku a staňte se členy klubu podporovatelů na Herohero. Kromě dobrého pocitu z podpory demokracie získáte třeba
          exkluzivní přístup ke kalkulačkám den přes oficiálním spuštěním! Přidat se na Herohero Nebo se přidejte k našemu týmu dobrovolníků a pomozte milionům lidí, kteří Volební kalkulačku
          využívají: třeba jen v prezidentských volbách 2023 si kalkulačku vyplnilo přes 1 milion lidí. Finančně přispět můžete i jednorázově. Chci se zapojit Chci přispět jednorázově Vaše podpora je
          klíčová pro to, abychom mohli pokračovat v naší práci pro nadcházející volby a vylepšovat kalkulačku. Děkujeme!
        </div>
        <div>
          Přidejte se do klubu podporovatelů Volební kalkulačky Podpořte Volební kalkulačku a staňte se členy klubu podporovatelů na Herohero. Kromě dobrého pocitu z podpory demokracie získáte třeba
          exkluzivní přístup ke kalkulačkám den přes oficiálním spuštěním! Přidat se na Herohero Nebo se přidejte k našemu týmu dobrovolníků a pomozte milionům lidí, kteří Volební kalkulačku
          využívají: třeba jen v prezidentských volbách 2023 si kalkulačku vyplnilo přes 1 milion lidí. Finančně přispět můžete i jednorázově. Chci se zapojit Chci přispět jednorázově Vaše podpora je
          klíčová pro to, abychom mohli pokračovat v naší práci pro nadcházející volby a vylepšovat kalkulačku. Děkujeme!
        </div>
        <div>
          Přidejte se do klubu podporovatelů Volební kalkulačky Podpořte Volební kalkulačku a staňte se členy klubu podporovatelů na Herohero. Kromě dobrého pocitu z podpory demokracie získáte třeba
          exkluzivní přístup ke kalkulačkám den přes oficiálním spuštěním! Přidat se na Herohero Nebo se přidejte k našemu týmu dobrovolníků a pomozte milionům lidí, kteří Volební kalkulačku
          využívají: třeba jen v prezidentských volbách 2023 si kalkulačku vyplnilo přes 1 milion lidí. Finančně přispět můžete i jednorázově. Chci se zapojit Chci přispět jednorázově Vaše podpora je
          klíčová pro to, abychom mohli pokračovat v naší práci pro nadcházející volby a vylepšovat kalkulačku. Děkujeme!
        </div>
      </Content>
    </div>
  );
}
