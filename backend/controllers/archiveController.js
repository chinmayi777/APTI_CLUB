import { randomUUID } from 'node:crypto';
import { mkdirSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import db from '../config/db.js';

const controllerDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.resolve(controllerDirectory, '../uploads/archive');
mkdirSync(uploadDirectory, { recursive: true });

const initialItems = [
  {
    id: 'legacy-handbook-career-catalyst-2',
    type: 'handbook',
    title: 'Career Catalyst Vol. 2',
    year: 2026,
    description: 'A complete roadmap covering aptitude, technical mastery, resume crafting, interview behaviour, and virtual hiring readiness. Created by the 2026 batch.',
    file_url: '/handbooks/Career_Catalyst_2026_pdf_20251222_131431_0000.pdf'
  },
  {
    id: 'legacy-handbook-career-catalyst-1',
    type: 'handbook',
    title: 'Career Catalyst Vol. 1',
    year: 2025,
    description: 'The first edition of the Career Catalyst handbook — foundational placement guidance from the 2025 batch seniors.',
    file_url: null
  },
  {
    id: 'legacy-handbook-placement-report-2025',
    type: 'handbook',
    title: '2025 Batch Placement Report',
    year: 2025,
    description: 'Comprehensive placement statistics, company-wise data, branch breakdowns and insights from the 2025 graduating batch.',
    file_url: null
  },
  {
    id: 'legacy-handbook-apti-2025',
    type: 'handbook',
    title: 'APTI 2025',
    year: 2025,
    description: '',
    file_url: '/handbooks/APTI%202025.pdf'
  },
  {
    id: 'legacy-handbook-apti-2026',
    type: 'handbook',
    title: 'APTI 2026 Full',
    year: 2026,
    description: '',
    file_url: '/handbooks/APTI%202026%20Full(3).pdf_20260429_130109_0000.pdf'
  },
  {
    id: 'legacy-handbook-apti-chronicle-3',
    type: 'handbook',
    title: 'APTI Chronicle - Vol. 3',
    year: 2026,
    description: '',
    file_url: '/handbooks/APTI%20Chronicle-%20Vol.3%20(1).pdf'
  },
  {
    id: 'legacy-handbook-apti-newsletter-1',
    type: 'handbook',
    title: 'APTI Club - Newsletter - Vol 1',
    year: 2024,
    description: '',
    file_url: '/handbooks/APTI%20Club%20-%20Newsletter%20-%20Vol%201.pdf'
  },
  {
    id: 'legacy-handbook-apti-club-2',
    type: 'handbook',
    title: 'APTI Club - Vol. 2',
    year: 2025,
    description: '',
    file_url: '/handbooks/APTI%20Club%20-%20Vol.2.pdf'
  },
  {
    id: 'legacy-handbook-apti-report-2024',
    type: 'handbook',
    title: 'APTI Club Report 2024',
    year: 2024,
    description: '',
    file_url: '/handbooks/APTI%20Club%20Report%202024.pdf'
  },
  {
    id: 'legacy-report-ltts-manisha',
    type: 'report',
    title: 'Manisha Angadi (ECE)',
    student_name: 'Manisha Angadi (ECE)',
    company: 'L&T Technology Services',
    year: 2025,
    package: null,
    file_url: '/reports/L_T_report_-_2025_batch.pdf'
  },
  {
    id: 'legacy-report-ltts-vaishnavi',
    type: 'report',
    title: 'Vaishnavi Bhat (CSE)',
    student_name: 'Vaishnavi Bhat (CSE)',
    company: 'L&T Technology Services',
    year: 2025,
    package: null,
    file_url: '/reports/L_T_Report_VaishnaviBhat.pdf'
  },
  {
    id: 'legacy-report-ltts-shravanthi',
    type: 'report',
    title: 'Shravanthi G U (ECE)',
    student_name: 'Shravanthi G U (ECE)',
    company: 'L&T Technology Services',
    year: 2025,
    package: null,
    file_url: '/reports/L_T.pdf'
  },
  {
    id: 'legacy-report-ltts-sahana',
    type: 'report',
    title: 'Sahana S. Hiremath (ECE)',
    student_name: 'Sahana S. Hiremath (ECE)',
    company: 'L&T Technology Services',
    year: 2025,
    package: null,
    file_url: '/reports/LTTS_Report.pdf'
  },
  {
    id: 'legacy-report-ltts-sinchana',
    type: 'report',
    title: 'Sinchana Aradhya B J (ECE)',
    student_name: 'Sinchana Aradhya B J (ECE)',
    company: 'L&T Technology Services',
    year: 2025,
    package: null,
    file_url: '/reports/LTTS.pdf'
  },
  {
    id: 'legacy-report-ltts-samatha',
    type: 'report',
    title: 'Samatha S (ECE)',
    student_name: 'Samatha S (ECE)',
    company: 'L&T Technology Services',
    year: 2025,
    package: null,
    file_url: '/reports/LTTS-1.pdf'
  },
  {
    id: 'legacy-report-applied-materials-monisha',
    type: 'report',
    title: 'Monisha B G (CSE)',
    student_name: 'Monisha B G (CSE)',
    company: 'Applied Materials',
    year: 2025,
    package: null,
    file_url: '/reports/Applied_Materials_Interview_Report_MonishaBG.pdf'
  },
  {
    id: 'legacy-report-dover-sanjana',
    type: 'report',
    title: 'Sanjana C R (ISE)',
    student_name: 'Sanjana C R (ISE)',
    company: 'Dover India Pvt Ltd',
    year: 2025,
    package: null,
    file_url: '/reports/dover_report.pdf'
  },
  {
    id: 'legacy-report-mindsprint-poornima',
    type: 'report',
    title: 'Poornima M (ISE)',
    student_name: 'Poornima M (ISE)',
    company: 'MindSprint',
    year: 2025,
    package: '5.2 LPA',
    file_url: '/reports/MindSprint_Report_Poornima_.pdf'
  },
  {
    id: 'legacy-report-hsbc-aashitha',
    type: 'report',
    title: 'Aashitha (CSE)',
    student_name: 'Aashitha (CSE)',
    company: 'HSBC Technology India',
    year: 2025,
    package: '15 LPA',
    file_url: '/reports/Aashitha_HSBC_Report.pdf'
  },
  {
    id: 'legacy-report-hsbc-poornima',
    type: 'report',
    title: 'Poornima M (ISE)',
    student_name: 'Poornima M (ISE)',
    company: 'HSBC Technology India',
    year: 2025,
    package: '15 LPA',
    file_url: '/reports/Poornima_M_HSBC_Technology_India_.pdf'
  },
  {
    id: 'legacy-report-thoughtworks-indushree',
    type: 'report',
    title: 'Indushree K N (ISE)',
    student_name: 'Indushree K N (ISE)',
    company: 'Thoughtworks',
    year: 2025,
    package: null,
    file_url: '/reports/Thoughtworks.pdf'
  }
];

export const archiveUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_req, file, callback) => {
      callback(null, `${randomUUID()}.pdf`);
    }
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const isPdf = file.mimetype === 'application/pdf' &&
      path.extname(file.originalname).toLowerCase() === '.pdf';
    callback(isPdf ? null : new Error('Only PDF files can be uploaded'), isPdf);
  }
});

let archiveInitialization;

const ensureArchiveTable = () => {
  if (!archiveInitialization) {
    archiveInitialization = (async () => {
      await db.execute(
        `CREATE TABLE IF NOT EXISTS archive_items (
           id VARCHAR(64) NOT NULL PRIMARY KEY,
           type ENUM('handbook', 'report') NOT NULL,
           title VARCHAR(255) NOT NULL,
           student_name VARCHAR(255) NULL,
           company VARCHAR(255) NULL,
           year SMALLINT UNSIGNED NOT NULL,
           \`package\` VARCHAR(100) NULL,
           description TEXT NULL,
           file_url VARCHAR(1000) NULL,
           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
           updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
           INDEX archive_items_type_year (type, year)
         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
      );

      const placeholders = initialItems.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
      const values = initialItems.flatMap(item => [
        item.id,
        item.type,
        item.title,
        item.student_name || null,
        item.company || null,
        item.year,
        item.package || null,
        item.description || null,
        item.file_url
      ]);
      await db.execute(
        `INSERT IGNORE INTO archive_items
           (id, type, title, student_name, company, year, \`package\`, description, file_url)
         VALUES ${placeholders}`,
        values
      );
    })().catch(error => {
      archiveInitialization = null;
      throw error;
    });
  }

  return archiveInitialization;
};

const getValidatedItem = (body, currentItem, fileUrl) => {
  const type = body.type || currentItem?.type;
  const year = Number(body.year);

  if (!['handbook', 'report'].includes(type)) {
    return { error: 'Select a valid archive item type' };
  }

  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return { error: 'Enter a valid year' };
  }

  if (type === 'report') {
    const studentName = String(body.student_name || '').trim();
    const company = String(body.company || '').trim();

    if (!studentName || !company) {
      return { error: 'Student name and company are required for reports' };
    }

    return {
      item: {
        type,
        title: studentName,
        student_name: studentName,
        company,
        year,
        package: String(body.package || '').trim() || null,
        description: null,
        file_url: fileUrl
      }
    };
  }

  const title = String(body.title || '').trim();
  if (!title) {
    return { error: 'A handbook title is required' };
  }

  return {
    item: {
      type,
      title,
      student_name: null,
      company: null,
      year,
      package: null,
      description: String(body.description || '').trim() || null,
      file_url: fileUrl
    }
  };
};

const deleteUploadedFile = file => {
  if (file) {
    try {
      unlinkSync(file.path);
    } catch (error) {
      console.error('Archive upload cleanup error:', error);
    }
  }
};

export const getArchiveItems = async (_req, res) => {
  try {
    await ensureArchiveTable();
    const [items] = await db.execute(
      `SELECT id, type, title, student_name, company, year, \`package\`,
              description, file_url
       FROM archive_items
       ORDER BY year DESC, title ASC`
    );
    return res.json({ success: true, items });
  } catch (error) {
    console.error('Archive list error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not retrieve archive items'
    });
  }
};

export const createArchiveItem = async (req, res) => {
  try {
    await ensureArchiveTable();
    const fileUrl = req.file ? `/archive-files/${req.file.filename}` : null;
    const { item, error } = getValidatedItem(req.body, null, fileUrl);

    if (error) {
      deleteUploadedFile(req.file);
      return res.status(400).json({ success: false, message: error });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Upload a PDF for this archive item'
      });
    }

    const id = randomUUID();
    await db.execute(
      `INSERT INTO archive_items
         (id, type, title, student_name, company, year, \`package\`, description, file_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        item.type,
        item.title,
        item.student_name,
        item.company,
        item.year,
        item.package,
        item.description,
        item.file_url
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Archive item added successfully',
      item: { id, ...item }
    });
  } catch (error) {
    deleteUploadedFile(req.file);
    console.error('Archive creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not add the archive item'
    });
  }
};

export const updateArchiveItem = async (req, res) => {
  try {
    await ensureArchiveTable();
    const [items] = await db.execute(
      'SELECT * FROM archive_items WHERE id = ?',
      [req.params.id]
    );

    if (!items.length) {
      deleteUploadedFile(req.file);
      return res.status(404).json({
        success: false,
        message: 'Archive item not found'
      });
    }

    const currentItem = items[0];
    const fileUrl = req.file
      ? `/archive-files/${req.file.filename}`
      : currentItem.file_url;
    const { item, error } = getValidatedItem(req.body, currentItem, fileUrl);

    if (error) {
      deleteUploadedFile(req.file);
      return res.status(400).json({ success: false, message: error });
    }

    await db.execute(
      `UPDATE archive_items
       SET type = ?, title = ?, student_name = ?, company = ?, year = ?,
           \`package\` = ?, description = ?, file_url = ?
       WHERE id = ?`,
      [
        item.type,
        item.title,
        item.student_name,
        item.company,
        item.year,
        item.package,
        item.description,
        item.file_url,
        req.params.id
      ]
    );

    return res.json({
      success: true,
      message: 'Archive item updated successfully',
      item: { id: req.params.id, ...item }
    });
  } catch (error) {
    deleteUploadedFile(req.file);
    console.error('Archive update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not update the archive item'
    });
  }
};

export const deleteArchiveItem = async (req, res) => {
  try {
    await ensureArchiveTable();

    const [items] = await db.execute(
      'SELECT file_url FROM archive_items WHERE id = ?',
      [req.params.id]
    );

    if (!items.length) {
      return res.status(404).json({
        success: false,
        message: 'Archive item not found'
      });
    }

    await db.execute('DELETE FROM archive_items WHERE id = ?', [req.params.id]);

    // Only remove PDFs uploaded to this archive. Leave legacy files alone.
    const match = items[0].file_url?.match(/^\/archive-files\/([a-f0-9-]+\.pdf)$/i);
    if (match) {
      try {
        unlinkSync(path.join(uploadDirectory, match[1]));
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error('Archive file deletion error:', error);
        }
      }
    }

    return res.json({
      success: true,
      message: 'Archive item deleted successfully'
    });
  } catch (error) {
    console.error('Archive deletion error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not delete the archive item'
    });
  }
};
