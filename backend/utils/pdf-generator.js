import PDFDocument from 'pdfkit';

function getColumnLabels() {
  return {
    name: 'Name',
    sku: 'SKU',
    description: 'Description',
    category_name: 'Category',
    subcategory_name: 'Subcategory',
    unit_name: 'Unit',
    location_name: 'Location',
    supplier_name: 'Supplier',
    quantity: 'Qty',
    min_quantity: 'Min Qty',
    max_quantity: 'Max Qty',
    unit_price: 'Unit Price',
    total_value: 'Total Value'
  };
}

function calculateColumnWidths(columns, columnWidthsOption, pageWidth) {
  let columnWidths = {};
  if (columnWidthsOption && Array.isArray(columnWidthsOption)) {
    columnWidthsOption.forEach(col => {
      columnWidths[col.id] = col.width;
    });
  }
  let totalSpecifiedWidth = 0;
  let unspecifiedColumns = 0;
  columns.forEach(col => {
    if (columnWidths[col]) {
      totalSpecifiedWidth += columnWidths[col];
    } else {
      unspecifiedColumns++;
    }
  });
  const defaultColumnWidth = unspecifiedColumns > 0 ? Math.max(80, (pageWidth - totalSpecifiedWidth) / unspecifiedColumns) : 0;
  let currentPosition = 50;
  const columnPositions = {};
  columns.forEach(col => {
    const width = columnWidths[col] || defaultColumnWidth;
    columnPositions[col] = currentPosition;
    currentPosition += width;
  });
  return { columnWidths, columnPositions, defaultColumnWidth };
}

function drawTableHeader(doc, columns, columnLabels, columnPositions, columnWidths, defaultColumnWidth, y) {
  doc.fontSize(10).font('Helvetica-Bold');
  columns.forEach(col => {
    doc.text(columnLabels[col] || col, columnPositions[col], y, {
      width: columnWidths[col] || defaultColumnWidth,
      align: 'left'
    });
  });
  doc.moveTo(50, y + 15).lineTo(doc.page.width - 50, y + 15).stroke();
}

function drawTableRows(doc, items, columns, columnLabels, columnPositions, columnWidths, defaultColumnWidth, itemHeight, options) {
  doc.font('Helvetica');
  let currentY = doc.y + 10;
  items.forEach((item, index) => {
    if (currentY > 700) {
      doc.addPage({ size: 'A4', layout: options.orientation || 'portrait' });
      currentY = 50;
      drawTableHeader(doc, columns, columnLabels, columnPositions, columnWidths, defaultColumnWidth, currentY);
      currentY += 25;
      doc.font('Helvetica');
    }
    columns.forEach(col => {
      let value = '';
      const width = columnWidths[col] || defaultColumnWidth;
      switch(col) {
        case 'name': value = item.name?.substring(0, 30) || ''; break;
        case 'sku': value = item.sku || ''; break;
        case 'description': value = item.description?.substring(0, 40) || ''; break;
        case 'category_name': value = item.category_name || ''; break;
        case 'subcategory_name': value = item.subcategory_name || ''; break;
        case 'unit_name': value = item.unit_name || ''; break;
        case 'location_name': value = item.location_name || ''; break;
        case 'supplier_name': value = item.supplier_name || ''; break;
        case 'quantity': value = item.quantity?.toString() || '0'; break;
        case 'min_quantity': value = item.min_quantity?.toString() || '0'; break;
        case 'max_quantity': value = item.max_quantity?.toString() || '0'; break;
        case 'unit_price': value = `$${(item.unit_price || 0).toFixed(2)}`; break;
        case 'total_value': value = `$${(item.total_value || 0).toFixed(2)}`; break;
        default: value = item[col]?.toString() || '';
      }
      doc.text(value, columnPositions[col], currentY, {
        width: width,
        align: 'left'
      });
    });
    currentY += itemHeight;
    if ((index + 1) % 5 === 0) {
      doc.moveTo(50, currentY - 5).lineTo(doc.page.width - 50, currentY - 5).stroke();
    }
  });
}

function drawSummary(doc, items) {
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.total_value || 0), 0);
  const lowStockItems = items.filter(item => item.quantity <= item.min_quantity).length;
  doc.fontSize(14).text('Summary:', { underline: true });
  doc.fontSize(12)
     .text(`Total Items: ${totalItems}`)
     .text(`Total Value: $${totalValue.toFixed(2)}`)
     .text(`Low Stock Items: ${lowStockItems}`)
     .moveDown();
}

export const generatePDF = async (items, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const pdfOptions = { 
        margin: 50,
        size: 'A4',
        layout: options.orientation || 'portrait'
      };
      const doc = new PDFDocument(pdfOptions);
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      const title = options.title || 'Inventory Report';
      const columns = options.columns || [
        'name', 'sku', 'category_name', 'quantity', 'unit_price', 'total_value', 'location_name'
      ];
      const columnLabels = getColumnLabels();
      const pageWidth = doc.page.width - 100;
      const { columnWidths, columnPositions, defaultColumnWidth } = calculateColumnWidths(columns, options.columnWidths, pageWidth);
      doc.fontSize(20).text(title, { align: 'center' });
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);
      drawSummary(doc, items);
      const tableTop = doc.y;
      const itemHeight = 20;
      drawTableHeader(doc, columns, columnLabels, columnPositions, columnWidths, defaultColumnWidth, tableTop);
      drawTableRows(doc, items, columns, columnLabels, columnPositions, columnWidths, defaultColumnWidth, itemHeight, options);
      doc.fontSize(8)
         .text(`Report generated by WMS - Page ${doc.bufferedPageRange().count}`, 
                50, doc.page.height - 50, { align: 'center' });
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};