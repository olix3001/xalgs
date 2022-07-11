import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import PDFDocument from 'pdfkit-table';

@Injectable()
export class PdfService {
  async buildTestingResultPdf(submission: any, res: Response) {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    // head table
    const headTable = {
      title: `Submission ${submission.id} results`,
      headers: [
        'Submission date',
        'Language',
        'Successful tests',
        'Test count',
        'Time limit',
        'Memory limit',
        'Percentage',
      ],
      rows: [
        [
          submission.submittedAt.toUTCString(),
          submission.lang,
          submission.TestResults.filter((e) => e.success).length.toString(),
          submission.TestResults.length.toString(),
          `${submission.task.timeLimit}s`,
          `${submission.task.memLimit}kb`,
          `${Math.floor(
            (submission.TestResults.filter((e) => e.success).length /
              submission.TestResults.length) *
              100,
          )}%`,
        ],
      ],
    };

    await doc.table(headTable, {
      width: doc.page.width - 60,
    });

    // details
    const detailsTable = {
      subtitle: 'Tests',
      headers: ['Id', 'Success', 'Error', 'Execution time', 'Used memory'],
      rows: submission.TestResults.map((result: any) => {
        return [
          result.id,
          result.success ? 'YES' : 'NO',
          result.success ? '—' : result.errorMessage,
          `${(result.executionTime / 1000).toFixed(2)}s`,
          `${result.memory}kb`,
        ];
      }),
    };

    await doc.table(detailsTable, {
      width: doc.page.width - 60,
    });

    doc.pipe(res);
    doc.end();
  }
}
