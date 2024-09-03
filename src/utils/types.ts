import {
  Book,
  Chapter,
  Commentary,
  Paragraph,
  Section,
  Subsection,
  Verse,
} from "@prisma/client";

export type BookWithRelations = Book & {
  chapters: (Chapter & {
    paragraphs: Paragraph[];
    verses: Verse[];
    sections: (Section & {
      paragraphs: Paragraph[];
      verses: Verse[];
      subsections: (Subsection & {
        paragraphs: (Paragraph & {
          commentaries: Commentary[];
        })[];
        verses: Verse[];
      })[];
    })[];
  })[];
};
