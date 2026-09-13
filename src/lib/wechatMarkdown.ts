import { Marked, type Tokens, type RendererObject, type RendererThis } from 'marked'
import type { ColorThemeId, TemplateStyleId } from '../types'
import {
  COLOR_THEMES,
  DEFAULT_COLOR_THEME,
  DEFAULT_TEMPLATE_STYLE,
  TEMPLATE_STYLES,
} from '../constants/themes'
import { highlightToInlineHtml, normalizeCodeLang } from './highlight'

type RenderThis = RendererThis
type Color = (typeof COLOR_THEMES)[ColorThemeId]

const WECHAT_FONT =
  "-apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif"
const MONO_FONT = 'Menlo, Monaco, Consolas, monospace'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** 公众号粘贴时，行内标签后紧跟中文标点常被拆行，把标点并入前一标签 */
function protectCjkPunctAfterInline(html: string): string {
  return html.replace(
    /<\/(b|i|s|span|code|a)>((?:<span style="white-space:nowrap;display:inline;">)?([、，。；：！？、·…—～「」『』（）【】《》〈〉“”‘’])<\/span>?)/gu,
    (_m, tag: string, _wrapped: string, ch: string) => `${ch}</${tag}>`,
  )
}

function renderHeading(
  text: string,
  depth: number,
  style: TemplateStyleId,
  color: Color,
): string {
  if (style === 'classic') {
    if (depth === 1) {
      return `<section style="margin: 36px 0 22px 0; text-align: center;"><h1 style="display: inline-block; font-size: 20px; font-weight: bold; color: ${color.primaryColor}; border-bottom: 2px solid ${color.primaryColor}; padding-bottom: 6px; margin: 0; letter-spacing: 1px; line-height: 1.4;">${text}</h1></section>\n`
    }
    if (depth === 2) {
      return `<section style="margin: 28px 0 16px 0; padding-left: 12px; border-left: 4px solid ${color.primaryColor};"><h2 style="font-size: 17px; font-weight: bold; color: ${color.textColor}; margin: 0; line-height: 1.5; letter-spacing: 0.5px;">${text}</h2></section>\n`
    }
    if (depth === 3) {
      return `<section style="margin: 22px 0 12px 0;"><h3 style="font-size: 16px; font-weight: bold; color: ${color.primaryColor}; margin: 0; line-height: 1.5;">${text}</h3></section>\n`
    }
  }

  if (style === 'modern-card') {
    if (depth === 1) {
      return `<section style="margin: 36px 0 24px 0; text-align: center;"><section style="display: inline-block; background-color: ${color.secondaryColor}; padding: 8px 24px; border-radius: 9999px; border: 1px solid ${color.primaryColor}33;"><h1 style="font-size: 19px; font-weight: bold; color: ${color.primaryColor}; margin: 0; letter-spacing: 1.5px; line-height: 1.4;">${text}</h1></section></section>\n`
    }
    if (depth === 2) {
      return `<section style="margin: 30px 0 18px 0; padding: 6px 14px; background: linear-gradient(to right, ${color.secondaryColor}, transparent); border-left: 4px solid ${color.primaryColor}; border-radius: 0 8px 8px 0;"><h2 style="font-size: 17px; font-weight: bold; color: ${color.textColor}; margin: 0; line-height: 1.5; letter-spacing: 0.5px;">${text}</h2></section>\n`
    }
    if (depth === 3) {
      return `<section style="margin: 22px 0 12px 0; padding-left: 14px;"><section style="display: inline-block; width: 6px; height: 6px; background-color: ${color.primaryColor}; border-radius: 50%; margin-right: 8px; vertical-align: middle;"></section><h3 style="display: inline; font-size: 16px; font-weight: bold; color: ${color.primaryColor}; margin: 0;">${text}</h3></section>\n`
    }
  }

  if (style === 'literary') {
    if (depth === 1) {
      return `<section style="margin: 38px 0 24px 0; text-align: center;"><div style="color: ${color.primaryColor}; font-size: 12px; letter-spacing: 4px; margin-bottom: 6px;">❖ ❖ ❖</div><h1 style="font-size: 21px; font-weight: 600; color: ${color.primaryColor}; margin: 0; letter-spacing: 2px; line-height: 1.4;">${text}</h1><div style="width: 40px; height: 1px; background-color: ${color.primaryColor}; margin: 10px auto 0; opacity: 0.6;"></div></section>\n`
    }
    if (depth === 2) {
      return `<section style="margin: 30px 0 16px 0;"><h2 style="font-size: 17px; font-weight: 600; color: ${color.textColor}; margin: 0; line-height: 1.5; letter-spacing: 1px;"><span style="color: ${color.primaryColor}; margin-right: 6px;">§</span>${text}</h2></section>\n`
    }
    if (depth === 3) {
      return `<section style="margin: 22px 0 12px 0;"><h3 style="font-size: 15px; font-weight: 600; color: ${color.primaryColor}; margin: 0; letter-spacing: 0.5px;">• ${text} •</h3></section>\n`
    }
  }

  // tech
  if (depth === 1) {
    // 用 pre/code + font face，公众号更易保留等宽与字号
    return `<section style="margin: 34px 0 20px 0; border-left: 5px solid ${color.primaryColor}; padding-left: 14px; background-color: transparent;"><pre style="margin: 0; padding: 0; background: transparent; border: 0; font-size: 11px; line-height: 1.4; white-space: pre-wrap;"><code style="font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; color: ${color.primaryColor}; font-weight: 600; font-size: 11px; background: transparent; padding: 0;">// SECTION HEADER</code></pre><h1 style="font-size: 19px; font-weight: bold; color: ${color.textColor}; margin: 4px 0 0 0; line-height: 1.4;">${text}</h1></section>\n`
  }
  if (depth === 2) {
    return `<section style="margin: 28px 0 16px 0; border-bottom: 1.5px dashed ${color.primaryColor}88; padding-bottom: 6px;"><h2 style="font-size: 16px; font-weight: bold; color: ${color.textColor}; margin: 0; line-height: 1.5;"><font face="Menlo, Monaco, Consolas, monospace" style="background-color: ${color.primaryColor}; color: #FFFFFF; font-size: 11px; padding: 2px 6px; border-radius: 3px; margin-right: 8px;">H2</font>${text}</h2></section>\n`
  }
  if (depth === 3) {
    return `<section style="margin: 20px 0 10px 0;"><h3 style="font-size: 15px; font-weight: bold; color: ${color.primaryColor}; margin: 0;"><font face="Menlo, Monaco, Consolas, monospace">[+] ${text}</font></h3></section>\n`
  }

  return `<h4 style="font-size: 15px; font-weight: bold; color: ${color.textColor}; margin: 16px 0 8px 0; line-height: 1.5;">${text}</h4>\n`
}

function renderBlockquoteContent(
  self: RenderThis,
  token: Tokens.Blockquote,
): string {
  const children = token.tokens as Tokens.Generic[]
  const paragraphs = children.filter((t) => t.type === 'paragraph') as Tokens.Paragraph[]
  const onlyParagraphs = paragraphs.length > 0 && paragraphs.length === children.length

  if (onlyParagraphs && paragraphs.length === 1) {
    return self.parser.parseInline(paragraphs[0].tokens)
  }
  if (onlyParagraphs) {
    return paragraphs
      .map((p, i) => {
        const text = self.parser.parseInline(p.tokens)
        const margin = i < paragraphs.length - 1 ? '0 0 10px 0' : '0'
        return `<section style="margin: ${margin}; line-height: 1.75;">${text}</section>`
      })
      .join('')
  }
  return self.parser
    .parse(children)
    .replace(
      /<p style="[^"]*margin: 0 0 16px 0;[^"]*">/g,
      '<section style="margin: 0 0 10px 0; line-height: 1.75;">',
    )
    .replace(/<\/p>/g, '</section>')
}

function renderBlockquoteHtml(content: string, style: TemplateStyleId, color: Color): string {
  if (style === 'classic') {
    return `<section style="margin: 22px 0; padding: 14px 16px; background-color: ${color.quoteBgColor}; border-left: 4px solid ${color.quoteBorderColor}; border-radius: 4px; color: #555555; font-size: 14px; line-height: 1.75; letter-spacing: 0.5px;">${content}</section>\n`
  }
  if (style === 'modern-card') {
    return `<section style="margin: 24px 0; padding: 16px 18px; background-color: #FFFFFF; border: 1px solid ${color.primaryColor}33; border-radius: 12px; box-shadow: 0 2px 10px ${color.primaryColor}10; color: #4B5563; font-size: 14px; line-height: 1.8;"><div style="color: ${color.primaryColor}; font-size: 20px; line-height: 1; margin-bottom: 6px; font-family: Georgia, serif;">“</div>${content}</section>\n`
  }
  if (style === 'literary') {
    return `<section style="margin: 26px 20px; padding: 14px 0; border-top: 1px solid ${color.primaryColor}44; border-bottom: 1px solid ${color.primaryColor}44; text-align: center; color: #666666; font-size: 14px; line-height: 1.8; font-style: italic;">${content}</section>\n`
  }
  return `<section style="margin: 22px 0; padding: 12px 16px; background-color: #F8F9FA; border: 1px solid #E5E7EB; border-left: 3px solid ${color.primaryColor}; font-size: 13.5px; line-height: 1.7; color: #4B5563; font-family: ${MONO_FONT};">${content}</section>\n`
}

function renderCodeBlock(raw: string, lang: string, style: TemplateStyleId, color: Color): string {
  const normalized = normalizeCodeLang(lang)
  const langLabel = (lang || '').trim().split(/\s+/)[0] || 'CODE'
  const highlighted = highlightToInlineHtml(raw, normalized)
  const lineCount = raw.split('\n').length

  if (style === 'tech') {
    return `<section style="margin: 20px 0; border-radius: 0; overflow: hidden; border: 1px solid ${color.textColor}; background-color: transparent;"><section style="padding: 6px 12px; background-color: ${color.primaryColor}; color: #FFFFFF; font-size: 11px; font-family: ${MONO_FONT}; font-weight: 600;">${escapeHtml(langLabel.toUpperCase())} · ${lineCount}L</section><pre style="margin: 0; padding: 14px; background-color: transparent; overflow-x: auto; font-family: ${MONO_FONT}; font-size: 13px; line-height: 1.65; color: ${color.textColor}; white-space: pre;"><code>${highlighted || escapeHtml(raw)}</code></pre></section>\n`
  }

  return `<section style="margin: 20px 0; border-radius: 8px; overflow: hidden; border: 1px solid #E5E7EB;"><table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0; border-spacing: 0; border-bottom: 1px solid #E5E7EB; background-color: #F8FAFC;"><tr><td style="padding: 8px 12px; font-size: 11px; font-family: ${MONO_FONT}; color: #94A3B8; border: 0; text-align: left;">CODE · ${lineCount}L</td><td style="padding: 8px 12px; font-size: 11px; font-family: ${MONO_FONT}; border: 0; text-align: right; color: ${color.primaryColor}; font-weight: 600;">${escapeHtml(langLabel.toUpperCase())}</td></tr></table><pre style="margin: 0; padding: 14px; background-color: ${color.codeBgColor}; overflow-x: auto; font-family: ${MONO_FONT}; font-size: 13px; line-height: 1.6; color: #333333; white-space: pre;"><code>${highlighted || escapeHtml(raw)}</code></pre></section>\n`
}

export function markdownToWechatHtml(
  markdown: string,
  templateStyleId: TemplateStyleId = DEFAULT_TEMPLATE_STYLE,
  colorThemeId: ColorThemeId = DEFAULT_COLOR_THEME,
): string {
  if (!markdown || !markdown.trim()) {
    return `<section style="max-width: 677px; margin: 0 auto; padding: 40px 16px; color: #9CA3AF; text-align: center; font-size: 14px; letter-spacing: 0.5px;">暂无内容，请在左侧编辑区输入 Markdown</section>`
  }

  const color = COLOR_THEMES[colorThemeId] || COLOR_THEMES[DEFAULT_COLOR_THEME]
  const style = templateStyleId
  const normalized = markdown.replace(/\r\n?/g, '\n')
  const markedInstance = new Marked()

  const renderer: RendererObject = {
    heading(this: RenderThis, { tokens, depth }: Tokens.Heading) {
      const text = this.parser.parseInline(tokens)
      return renderHeading(text, depth, style, color)
    },

    paragraph(this: RenderThis, { tokens }: Tokens.Paragraph) {
      const text = this.parser.parseInline(tokens)
      return `<p style="font-size: 15px; line-height: 1.75; color: ${color.textColor}; margin: 0 0 16px 0; text-align: justify; word-break: normal; overflow-wrap: break-word; letter-spacing: 0.5px;">${text}</p>\n`
    },

    blockquote(this: RenderThis, token: Tokens.Blockquote) {
      const content = renderBlockquoteContent(this, token)
      return renderBlockquoteHtml(content, style, color)
    },

    list(this: RenderThis, token: Tokens.List) {
      const tag = token.ordered ? 'ol' : 'ul'
      const listStyle = token.ordered ? 'decimal' : 'disc'
      let body = ''
      for (const item of token.items) {
        const inlineTokens: Tokens.Generic[] = []
        for (const t of item.tokens as Tokens.Generic[]) {
          if ((t.type === 'text' || t.type === 'paragraph') && 'tokens' in t && Array.isArray(t.tokens)) {
            inlineTokens.push(...(t.tokens as Tokens.Generic[]))
          } else {
            inlineTokens.push(t)
          }
        }
        const text = protectCjkPunctAfterInline(this.parser.parseInline(inlineTokens))
        body += `<li style="margin: 0 0 8px 0; line-height: 1.75; word-break: normal; overflow-wrap: break-word;"><section style="font-size: 15px; line-height: 1.75; color: ${color.textColor}; word-break: normal; letter-spacing: 0px;">${text}</section></li>\n`
      }
      return `<${tag} style="margin: 12px 0 16px 20px; padding: 0; list-style-type: ${listStyle}; font-size: 15px; line-height: 1.75; color: ${color.textColor}; word-break: normal;">\n${body}</${tag}>\n`
    },

    strong(this: RenderThis, { tokens }: Tokens.Strong) {
      const text = this.parser.parseInline(tokens)
      return `<b style="font-weight: 700; color: ${color.primaryColor};">${text}</b>`
    },

    em(this: RenderThis, { tokens }: Tokens.Em) {
      const text = this.parser.parseInline(tokens)
      return `<i style="font-style: italic; color: #666666;">${text}</i>`
    },

    del(this: RenderThis, { tokens }: Tokens.Del) {
      const text = this.parser.parseInline(tokens)
      return `<s style="color: #9CA3AF; text-decoration: line-through;">${text}</s>`
    },

    codespan({ text }: Tokens.Codespan) {
      return `<code style="padding: 2px 6px; background-color: ${color.secondaryColor}; color: ${color.primaryColor}; border-radius: 4px; font-size: 13px; font-family: ${MONO_FONT}; margin: 0 2px;">${escapeHtml(text)}</code>`
    },

    code(token: Tokens.Code) {
      return renderCodeBlock(token.text || '', token.lang || '', style, color)
    },

    hr() {
      if (style === 'literary') {
        return `<section style="margin: 32px 0; text-align: center; color: ${color.primaryColor}; font-size: 14px; opacity: 0.5;">✦ ✦ ✦</section>\n`
      }
      return `<hr style="margin: 28px auto; border: none; border-top: 1px dashed #D1D5DB; width: 60%;" />\n`
    },

    table(this: RenderThis, token: Tokens.Table) {
      const renderCell = (cell: Tokens.TableCell) => {
        const tag = cell.header ? 'th' : 'td'
        const text = this.parser.parseInline(cell.tokens)
        const bg = cell.header
          ? `background-color: ${color.secondaryColor}; font-weight: bold; color: ${color.primaryColor};`
          : 'background-color: #FFFFFF;'
        const align = cell.align ? `text-align: ${cell.align};` : ''
        return `<${tag} style="padding: 10px 12px; border: 1px solid #E5E7EB; ${bg} ${align}">${text}</${tag}>`
      }

      let headerCells = ''
      for (const cell of token.header) headerCells += renderCell(cell)
      let bodyRows = ''
      for (const row of token.rows) {
        let rowCells = ''
        for (const cell of row) rowCells += renderCell(cell)
        bodyRows += `<tr>${rowCells}</tr>\n`
      }

      return `<div style="margin: 20px 0; overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.5; text-align: left;"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>\n`
    },

    link(this: RenderThis, { href, tokens }: Tokens.Link) {
      const text = this.parser.parseInline(tokens)
      return `<a href="${href}" style="color: ${color.primaryColor}; text-decoration: underline; word-break: break-all;">${text}</a>`
    },

    image({ href, title, text }: Tokens.Image) {
      return `<figure style="margin: 20px 0; text-align: center;"><img src="${href}" alt="${text}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto;" />${title || text ? `<figcaption style="margin-top: 8px; font-size: 12px; color: #888888;">${title || text}</figcaption>` : ''}</figure>\n`
    },
  }

  markedInstance.use({ renderer })
  const rawHtml = protectCjkPunctAfterInline(markedInstance.parse(normalized) as string)

  const styleName = TEMPLATE_STYLES[style]?.name || TEMPLATE_STYLES.classic.name
  return `<section style="max-width: 677px; margin: 0 auto; padding: 16px 18px; font-family: ${WECHAT_FONT}; -webkit-font-smoothing: antialiased; background-color: #FFFFFF; box-sizing: border-box;">${rawHtml}<section style="margin-top: 40px; padding-top: 16px; border-top: 1px dashed #E5E7EB; text-align: center; color: #9CA3AF; font-size: 12px;"><p style="margin: 0; line-height: 1.6;">— 本文使用微笺排版 · ${styleName} · ${color.name} —</p></section></section>`
}
