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
    paragraphs: (Paragraph & {
      commentaries: Commentary[];
      // paraIdRef: React.RefObject<any>;
    })[];
    verses: Verse[];
    sections: (Section & {
      paragraphs: (Paragraph & {
        commentaries: Commentary[];
        // paraIdRef: React.RefObject<any>;
      })[];
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
