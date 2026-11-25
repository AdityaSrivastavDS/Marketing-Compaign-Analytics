const fs = require('fs');

// Premium Executive Consulting Palette (SOLVENNE)
const THEME = {
  canvasBg: "#F1F5F9",        // Soft executive slate background
  cardBg: "#FFFFFF",          // Crisp white container cards
  cardBorder: "#CBD5E1",      // Polished subtle border
  cardBorderAccent: "#94A3B8",
  headerBg: "#0F172A",        // Deep Navy Slate banner
  primaryText: "#0F172A",     // High contrast dark text
  secondaryText: "#64748B",   // Neutral gray caption text
  
  // High-Impact Strategic Accent Colors
  teal: "#0D9488",            // Key conversion / success
  tealGlow: "#14B8A6",
  indigo: "#4F46E5",          // Core volume / customers
  blue: "#2563EB",            // Corporate performance
  skyBlue: "#0284C7",         // Secondary channels
  burgundy: "#991B1B",        // Flagship Wine category
  crimson: "#E11D48",         // Premium Meat category
  amber: "#D97706",           // Gold luxury / caution
  emerald: "#059669",         // High efficiency / Tier 1
  purple: "#7C3AED",          // Confectionery / omnichannel
  coral: "#EA580C",           // Catalog / direct
  darkSlate: "#1E293B"
};

// Helper to create visual container config with both objects and vcObjects
function createVisualContainer(x, y, w, h, z, visualType, queryState, prototypeQuery, objects = {}, title = "", containerBg = THEME.cardBg) {
  const name = "vc_" + Math.random().toString(36).substring(2, 12);
  
  // Build vcObjects (Visual Container Objects) for Power BI container formatting
  const vcObjects = {
    background: [{
      properties: {
        show: { expr: { Literal: { Value: "true" } } },
        color: { solid: { color: { expr: { Literal: { Value: `'${containerBg}'` } } } } },
        transparency: { expr: { Literal: { Value: "0D" } } }
      }
    }],
    border: [{
      properties: {
        show: { expr: { Literal: { Value: "true" } } },
        color: { solid: { color: { expr: { Literal: { Value: `'${THEME.cardBorder}'` } } } } },
        radius: { expr: { Literal: { Value: "8D" } } }
      }
    }],
    dropShadow: [{
      properties: {
        show: { expr: { Literal: { Value: "true" } } },
        color: { solid: { color: { expr: { Literal: { Value: "'#0F172A'" } } } } },
        position: { expr: { Literal: { Value: "'Outer'" } } },
        preset: { expr: { Literal: { Value: "'BottomRight'" } } },
        transparency: { expr: { Literal: { Value: "92D" } } }
      }
    }]
  };

  if (title) {
    vcObjects.title = [{
      properties: {
        show: { expr: { Literal: { Value: "true" } } },
        text: { expr: { Literal: { Value: `'${title.replace(/'/g, "''")}'` } } },
        fontSize: { expr: { Literal: { Value: "10.5D" } } },
        fontFamily: { expr: { Literal: { Value: "'Segoe UI Semibold'" } } },
        fontColor: { solid: { color: { expr: { Literal: { Value: `'${THEME.primaryText}'` } } } } }
      }
    }];
    
    // Also include title in objects for backwards compatibility
    if (!objects.title) {
      objects.title = [{
        properties: {
          show: { expr: { Literal: { Value: "true" } } },
          text: { expr: { Literal: { Value: `'${title.replace(/'/g, "''")}'` } } },
          fontSize: { expr: { Literal: { Value: "10.5D" } } },
          fontFamily: { expr: { Literal: { Value: "'Segoe UI Semibold'" } } },
          fontColor: { solid: { color: { expr: { Literal: { Value: `'${THEME.primaryText}'` } } } } }
        }
      }];
    }
  }

  // Ensure card styling in objects as well
  if (!objects.background) {
    objects.background = [{
      properties: {
        show: { expr: { Literal: { Value: "true" } } },
        color: { solid: { color: { expr: { Literal: { Value: `'${containerBg}'` } } } } },
        transparency: { expr: { Literal: { Value: "0D" } } }
      }
    }];
  }
  if (!objects.border) {
    objects.border = [{
      properties: {
        show: { expr: { Literal: { Value: "true" } } },
        color: { solid: { color: { expr: { Literal: { Value: `'${THEME.cardBorder}'` } } } } },
        radius: { expr: { Literal: { Value: "8D" } } }
      }
    }];
  }

  const singleVisual = {
    visualType: visualType,
    projections: queryState.projections || {},
    prototypeQuery: prototypeQuery,
    drillFilterOtherVisuals: true,
    objects: objects,
    vcObjects: vcObjects
  };

  const configObj = {
    name: name,
    layouts: [
      {
        id: 0,
        position: { x, y, z, width: w, height: h }
      }
    ],
    singleVisual: singleVisual
  };

  return {
    x: x,
    y: y,
    z: z,
    width: w,
    height: h,
    config: JSON.stringify(configObj),
    filters: "[]"
  };
}

// Helper to create Header Banner
function createHeaderBanner(pageTitle, subtitle, pageNum = 1) {
  const name = "hdr_" + Math.random().toString(36).substring(2, 10);
  const config = {
    name: name,
    layouts: [{ id: 0, position: { x: 0, y: 0, z: 0, width: 1280, height: 62 } }],
    singleVisual: {
      visualType: "textbox",
      drillFilterOtherVisuals: true,
      objects: {
        general: [{
          properties: {
            paragraphs: [
              {
                textRuns: [
                  { value: "  SOLVENNE  ", textStyle: { fontWeight: "bold", fontSize: "14pt", color: THEME.tealGlow } },
                  { value: "AI × DATA × CONSULTING   |   ", textStyle: { fontSize: "10pt", color: "#94A3B8" } },
                  { value: `PAGE ${pageNum} : ${pageTitle.toUpperCase()}`, textStyle: { fontWeight: "bold", fontSize: "12pt", color: "#FFFFFF" } },
                  { value: "   [ REF YEAR: 2014 | 2,240 VALIDATED RECORDS ]", textStyle: { fontSize: "8.5pt", color: "#38BDF8" } }
                ]
              },
              {
                textRuns: [
                  { value: "  " + subtitle, textStyle: { fontSize: "9pt", color: "#CBD5E1" } }
                ]
              }
            ]
          }
        }],
        background: [{
          properties: {
            show: { expr: { Literal: { Value: "true" } } },
            color: { solid: { color: { expr: { Literal: { Value: `'${THEME.headerBg}'` } } } } }
          }
        }]
      },
      vcObjects: {
        background: [{
          properties: {
            show: { expr: { Literal: { Value: "true" } } },
            color: { solid: { color: { expr: { Literal: { Value: `'${THEME.headerBg}'` } } } } },
            transparency: { expr: { Literal: { Value: "0D" } } }
          }
        }]
      }
    }
  };
  return {
    x: 0, y: 0, z: 0, width: 1280, height: 62,
    config: JSON.stringify(config),
    filters: "[]"
  };
}

// Helper to create Footer Banner
function createFooterBanner(disclosure = "Data Source: marketing_data.csv (2,240 customers) | Reference Year for Age: 2014 | Product spends reflect 2-year customer totals | Income whitespace cleaned | SOLVENNE Analytics") {
  const name = "ftr_" + Math.random().toString(36).substring(2, 10);
  const config = {
    name: name,
    layouts: [{ id: 0, position: { x: 0, y: 692, z: 0, width: 1280, height: 28 } }],
    singleVisual: {
      visualType: "textbox",
      drillFilterOtherVisuals: true,
      objects: {
        general: [{
          properties: {
            paragraphs: [
              {
                textRuns: [
                  { value: "  " + disclosure, textStyle: { fontSize: "7.5pt", color: "#64748B" } }
                ]
              }
            ]
          }
        }],
        background: [{
          properties: {
            show: { expr: { Literal: { Value: "true" } } },
            color: { solid: { color: { expr: { Literal: { Value: "'#0F172A'" } } } } }
          }
        }]
      },
      vcObjects: {
        background: [{
          properties: {
            show: { expr: { Literal: { Value: "true" } } },
            color: { solid: { color: { expr: { Literal: { Value: "'#0F172A'" } } } } },
            transparency: { expr: { Literal: { Value: "0D" } } }
          }
        }]
      }
    }
  };
  return {
    x: 0, y: 692, z: 0, width: 1280, height: 28,
    config: JSON.stringify(config),
    filters: "[]"
  };
}

// Helper to create KPI Card with Vibrant Color and Card Container
function createKpiCard(x, y, w, h, z, measureName, title, accentColor = THEME.teal) {
  const queryRef = `Customer.${measureName}`;
  const queryState = {
    projections: {
      Values: [{ queryRef: queryRef }]
    }
  };
  const protoQuery = {
    Version: 2,
    From: [{ Name: "c", Entity: "Customer", Type: 0 }],
    Select: [
      {
        Measure: {
          Expression: { SourceRef: { Source: "c" } },
          Property: measureName
        },
        Name: queryRef
      }
    ]
  };
  const objects = {
    labels: [
      {
        properties: {
          fontSize: { expr: { Literal: { Value: "21D" } } },
          fontFamily: { expr: { Literal: { Value: "'Segoe UI Semibold'" } } },
          color: { solid: { color: { expr: { Literal: { Value: `'${accentColor}'` } } } } }
        }
      }
    ],
    categoryLabels: [
      {
        properties: {
          show: { expr: { Literal: { Value: "true" } } },
          color: { solid: { color: { expr: { Literal: { Value: "'#475569'" } } } } },
          fontSize: { expr: { Literal: { Value: "8.5D" } } },
          fontFamily: { expr: { Literal: { Value: "'Segoe UI'" } } }
        }
      }
    ]
  };
  return createVisualContainer(x, y, w, h, z, "card", queryState, protoQuery, objects, title);
}

// Helper to create Slicer (Clean Dropdown Mode)
function createSlicer(x, y, w, h, z, column, title) {
  const queryRef = `Customer.${column}`;
  const queryState = {
    projections: {
      Values: [{ queryRef: queryRef }]
    }
  };
  const protoQuery = {
    Version: 2,
    From: [{ Name: "c", Entity: "Customer", Type: 0 }],
    Select: [
      {
        Column: {
          Expression: { SourceRef: { Source: "c" } },
          Property: column
        },
        Name: queryRef
      }
    ]
  };
  const objects = {
    data: [
      {
        properties: {
          mode: { expr: { Literal: { Value: "'Dropdown'" } } }
        }
      }
    ],
    header: [
      {
        properties: {
          show: { expr: { Literal: { Value: "true" } } },
          text: { expr: { Literal: { Value: `'${title.replace(/'/g, "''")}'` } } },
          fontColor: { solid: { color: { expr: { Literal: { Value: "'#0F172A'" } } } } },
          textSize: { expr: { Literal: { Value: "9D" } } },
          fontFamily: { expr: { Literal: { Value: "'Segoe UI Semibold'" } } }
        }
      }
    ],
    items: [
      {
        properties: {
          fontColor: { solid: { color: { expr: { Literal: { Value: "'#1E293B'" } } } } },
          textSize: { expr: { Literal: { Value: "9D" } } }
        }
      }
    ]
  };
  return createVisualContainer(x, y, w, h, z, "slicer", queryState, protoQuery, objects, "");
}

// Helper to create Bar or Column Chart with Data Labels and Vibrant Colors
function createBarColumnChart(x, y, w, h, z, visualType, categoryCol, measureName, title, fillColor = THEME.blue) {
  const catRef = `Customer.${categoryCol}`;
  const valRef = `Customer.${measureName}`;
  const isHorizontal = visualType === "clusteredBarChart";

  const projections = {};
  if (isHorizontal) {
    projections.Category = [{ queryRef: catRef }];
    projections.Y = [{ queryRef: valRef }];
  } else {
    projections.Category = [{ queryRef: catRef }];
    projections.Y = [{ queryRef: valRef }];
  }

  const queryState = { projections };
  const protoQuery = {
    Version: 2,
    From: [{ Name: "c", Entity: "Customer", Type: 0 }],
    Select: [
      {
        Column: {
          Expression: { SourceRef: { Source: "c" } },
          Property: categoryCol
        },
        Name: catRef
      },
      {
        Measure: {
          Expression: { SourceRef: { Source: "c" } },
          Property: measureName
        },
        Name: valRef
      }
    ]
  };
  const objects = {
    dataPoint: [
      {
        properties: {
          fill: { solid: { color: { expr: { Literal: { Value: `'${fillColor}'` } } } } }
        }
      }
    ],
    labels: [
      {
        properties: {
          show: { expr: { Literal: { Value: "true" } } },
          color: { solid: { color: { expr: { Literal: { Value: "'#1E293B'" } } } } },
          fontSize: { expr: { Literal: { Value: "8.5D" } } },
          fontFamily: { expr: { Literal: { Value: "'Segoe UI Semibold'" } } }
        }
      }
    ],
    categoryAxis: [
      {
        properties: {
          show: { expr: { Literal: { Value: "true" } } },
          fontSize: { expr: { Literal: { Value: "8.5D" } } },
          fontColor: { solid: { color: { expr: { Literal: { Value: "'#334155'" } } } } }
        }
      }
    ],
    valueAxis: [
      {
        properties: {
          show: { expr: { Literal: { Value: "true" } } },
          fontSize: { expr: { Literal: { Value: "8D" } } },
          fontColor: { solid: { color: { expr: { Literal: { Value: "'#64748B'" } } } } }
        }
      }
    ]
  };
  return createVisualContainer(x, y, w, h, z, visualType, queryState, protoQuery, objects, title);
}

// Helper to create Donut Chart with Legend and Percent Labels
function createDonutChart(x, y, w, h, z, categoryCol, measureName, title) {
  const catRef = `Customer.${categoryCol}`;
  const valRef = `Customer.${measureName}`;
  const queryState = {
    projections: {
      Category: [{ queryRef: catRef }],
      Y: [{ queryRef: valRef }]
    }
  };
  const protoQuery = {
    Version: 2,
    From: [{ Name: "c", Entity: "Customer", Type: 0 }],
    Select: [
      {
        Column: {
          Expression: { SourceRef: { Source: "c" } },
          Property: categoryCol
        },
        Name: catRef
      },
      {
        Measure: {
          Expression: { SourceRef: { Source: "c" } },
          Property: measureName
        },
        Name: valRef
      }
    ]
  };
  const objects = {
    legend: [{
      properties: {
        show: { expr: { Literal: { Value: "true" } } },
        position: { expr: { Literal: { Value: "'Right'" } } },
        fontSize: { expr: { Literal: { Value: "8.5D" } } },
        fontColor: { solid: { color: { expr: { Literal: { Value: "'#334155'" } } } } }
      }
    }],
    labels: [{
      properties: {
        show: { expr: { Literal: { Value: "true" } } },
        labelStyle: { expr: { Literal: { Value: "'Category, percent of total'" } } },
        fontSize: { expr: { Literal: { Value: "8.5D" } } },
        fontColor: { solid: { color: { expr: { Literal: { Value: "'#1E293B'" } } } } }
      }
    }]
  };
  return createVisualContainer(x, y, w, h, z, "donutChart", queryState, protoQuery, objects, title);
}

// Helper to create Data Table
function createDataTable(x, y, w, h, z, columns, measures, title) {
  const projections = [];
  const selectItems = [];

  columns.forEach(col => {
    const qref = `Customer.${col}`;
    projections.push({ queryRef: qref });
    selectItems.push({
      Column: {
        Expression: { SourceRef: { Source: "c" } },
        Property: col
      },
      Name: qref
    });
  });

  measures.forEach(m => {
    const qref = `Customer.${m}`;
    projections.push({ queryRef: qref });
    selectItems.push({
      Measure: {
        Expression: { SourceRef: { Source: "c" } },
        Property: m
      },
      Name: qref
    });
  });

  const queryState = {
    projections: {
      Values: projections
    }
  };

  const protoQuery = {
    Version: 2,
    From: [{ Name: "c", Entity: "Customer", Type: 0 }],
    Select: selectItems
  };

  const objects = {
    grid: [{
      properties: {
        textSize: { expr: { Literal: { Value: "8.5D" } } }
      }
    }],
    columnHeaders: [{
      properties: {
        fontColor: { solid: { color: { expr: { Literal: { Value: "'#FFFFFF'" } } } } },
        backColor: { solid: { color: { expr: { Literal: { Value: `'${THEME.headerBg}'` } } } } },
        fontSize: { expr: { Literal: { Value: "9D" } } }
      }
    }]
  };

  return createVisualContainer(x, y, w, h, z, "tableEx", queryState, protoQuery, objects, title);
}

// Helper for Styled Executive Insight Card
function createInsightBox(x, y, w, h, z, title, bullets) {
  const name = "ins_" + Math.random().toString(36).substring(2, 10);
  const paragraphs = [
    {
      textRuns: [
        { value: "  " + title.toUpperCase() + "\n", textStyle: { fontWeight: "bold", fontSize: "11pt", color: THEME.indigo } }
      ]
    }
  ];
  
  bullets.forEach((b, idx) => {
    let tag = "";
    let text = "";
    const colors = [THEME.teal, THEME.indigo, THEME.emerald, THEME.amber, THEME.blue];
    let color = colors[idx % colors.length];
    if (typeof b === "string") {
      const colonIdx = b.indexOf(":");
      if (colonIdx > 0 && colonIdx < 40) {
        tag = b.substring(0, colonIdx).trim();
        text = b.substring(colonIdx + 1).trim();
      } else {
        tag = "Key Takeaway " + (idx + 1);
        text = b.trim();
      }
    } else {
      tag = b.tag || ("Key Metric " + (idx + 1));
      text = b.text || "";
      color = b.color || color;
    }
    paragraphs.push({
      textRuns: [
        { value: "  • " + tag + ": ", textStyle: { fontWeight: "bold", fontSize: "9pt", color: color } },
        { value: text + "\n", textStyle: { fontSize: "8.5pt", color: THEME.primaryText } }
      ]
    });
  });

  const config = {
    name: name,
    layouts: [{ id: 0, position: { x, y, z, width: w, height: h } }],
    singleVisual: {
      visualType: "textbox",
      drillFilterOtherVisuals: true,
      objects: {
        general: [{
          properties: {
            paragraphs: paragraphs
          }
        }],
        background: [{
          properties: {
            show: { expr: { Literal: { Value: "true" } } },
            color: { solid: { color: { expr: { Literal: { Value: "'#F8FAFC'" } } } } }
          }
        }],
        border: [{
          properties: {
            show: { expr: { Literal: { Value: "true" } } },
            color: { solid: { color: { expr: { Literal: { Value: `'${THEME.cardBorder}'` } } } } },
            radius: { expr: { Literal: { Value: "8D" } } }
          }
        }]
      },
      vcObjects: {
        background: [{
          properties: {
            show: { expr: { Literal: { Value: "true" } } },
            color: { solid: { color: { expr: { Literal: { Value: "'#F8FAFC'" } } } } },
            transparency: { expr: { Literal: { Value: "0D" } } }
          }
        }],
        border: [{
          properties: {
            show: { expr: { Literal: { Value: "true" } } },
            color: { solid: { color: { expr: { Literal: { Value: `'${THEME.cardBorder}'` } } } } },
            radius: { expr: { Literal: { Value: "8D" } } }
          }
        }],
        dropShadow: [{
          properties: {
            show: { expr: { Literal: { Value: "true" } } },
            color: { solid: { color: { expr: { Literal: { Value: "'#0F172A'" } } } } },
            position: { expr: { Literal: { Value: "'Outer'" } } },
            preset: { expr: { Literal: { Value: "'BottomRight'" } } },
            transparency: { expr: { Literal: { Value: "92D" } } }
          }
        }]
      }
    }
  };

  return {
    x, y, z, width: w, height: h,
    config: JSON.stringify(config),
    filters: "[]"
  };
}

module.exports = {
  THEME,
  createHeaderBanner,
  createFooterBanner,
  createKpiCard,
  createSlicer,
  createBarColumnChart,
  createDonutChart,
  createDataTable,
  createInsightBox
};
