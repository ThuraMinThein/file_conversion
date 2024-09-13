import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';

export const useTemplate = async (
  name: string,
  course: string,
  templateFile: Express.Multer.File,
) => {
  const zip = new PizZip(templateFile.buffer);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.setData({
    name: name,
    course: course,
  });

  try {
    doc.render();
  } catch (error) {
    throw new Error(`Error rendering document: ${error}`);
  }

  // Generate the buffer from the document
  const outputBuffer = doc.getZip().generate({ type: 'nodebuffer' });

  return outputBuffer;
};
