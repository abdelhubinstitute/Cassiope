## Hub Institute App Design Guidelines for Coders

**Overall Philosophy:**
The app should reflect a modern, professional, dynamic, and trustworthy brand focused on "Business Acceleration & Positive Impact." It needs to be insightful, clean, and user-centric, facilitating access to information and community features.

---

**I. Color Palette**

| Type             | Color Name(s)             | Hex Code (Approximate/Inferred) | Usage Examples                                                                 |
| :--------------- | :------------------------ | :------------------------------ | :----------------------------------------------------------------------------- |
| **Primary Dark** | Deep Navy / Charcoal      | `#010130` / `#23233D`           | Main backgrounds (headers, footers, some sections), dark text on light bg.     |
| **Primary Accent**| Vibrant Violet / Purple   | `#6F2C91` / `#8A2BE2` (variants) | Key CTAs, highlighted titles, section dividers, icons, important links.        |
| **Secondary Accent**| Bright Blue               | `#0077B5` / `#3D85C6` (variants) | Secondary CTAs, informational links, sub-navigation elements, some icons.    |
| **Neutral Light**| Pure White                | `#FFFFFF`                       | Main content backgrounds, text on dark backgrounds, card backgrounds.          |
| **Neutral Off-White**| Light Lavender / Off-White| `#FBF3FF` / `#F8F9FA`           | Subtle background variations, alternating card/section backgrounds.             |
| **Greys**        | Light, Medium, Dark Grey  | `#CCCCCC`, `#888888`, `#4A4A4A`   | Body text, secondary text, borders, dividers, disabled states.             |
| **Text Colors**  | Dark Grey / Near Black    | `#333333` / `#010130`           | Main body text on light backgrounds.                                           |
|                  | White                     | `#FFFFFF`                       | Text on dark backgrounds (headers, footers, violet/blue sections).             |
| **Semantic**     | (Standard error/success)  | (e.g., `#D32F2F`, `#43A047`)    | For form validation, notifications (use sparingly and standardly).             |

*Coders Note: Exact hex codes should be sourced from a style guide or by inspecting the live website. The above are inferred.*

---

**II. Typography**

| Element                     | Font Family | Weight(s)                 | Size (Relative)    | Case         | Line Height (Approx.) | Letter Spacing (Approx.) | Color Usage                        |
| :-------------------------- | :---------- | :------------------------ | :----------------- | :----------- | :-------------------- | :----------------------- | :--------------------------------- |
| **Main Headings (H1)**      | Poppins     | Bold (700), ExtraBold (800) | Very Large (e.g., 2.5-3.5rem) | Sentence/Title | 1.2 - 1.3             | Normal/-0.5px            | White (on dark), Dark Grey/Navy (on light) |
| **Sub-Headings (H2)**       | Poppins     | Bold (700), SemiBold (600)| Large (e.g., 1.8-2.5rem)   | Sentence/Title | 1.3 - 1.4             | Normal                   | Violet, Blue, Dark Grey/Navy       |
| **Section Titles (H3)**     | Poppins     | Medium (500), SemiBold (600)| Medium-Large (e.g., 1.4-1.8rem) | Sentence/Title | 1.4 - 1.5             | Normal                   | Dark Grey/Navy, Violet             |
| **Card Titles / H4**        | Poppins     | Medium (500), SemiBold (600)| Medium (e.g., 1.1-1.3rem)  | Sentence/Title | 1.4                   | Normal                   | Dark Grey/Navy                     |
| **Body Text / Paragraphs**  | Open Sans   | Regular (400)             | Standard (e.g., 1rem/16px) | Sentence     | 1.5 - 1.7             | Normal                   | Dark Grey (`#333`), Medium Grey   |
| **Small Text / Captions**   | Open Sans   | Regular (400), Light (300)| Small (e.g., 0.8-0.9rem)   | Sentence     | 1.4 - 1.5             | Normal                   | Medium Grey, Light Grey            |
| **Button Text**             | Poppins     | Medium (500), SemiBold (600)| Standard/Slightly Small | Varies (may include UPPERCASE) | 1 (or auto)           | 0.5px - 1px              | White, Violet, Blue                |
| **Navigation Links**        | Poppins (Primary Nav), Open Sans (Sur-Header) | Bold (700), SemiBold (600) for Poppins; Regular (400) for Open Sans | Standard/Slightly Small | Varies (may include UPPERCASE) | 1 (or auto)           | Normal                   | Blue, Dark Grey/Navy, White        |
| **Highlighted/Styled Text**| Poppins     | Bold (700) / Italic       | Varies             | Varies       | Varies                | Varies                   | Violet, Blue                       |

*Coders Note: Prioritize Poppins for headings and impactful text. Open Sans for readability in longer content. Ensure good contrast ratios.*

---

**III. Layout & Spacing**

| Aspect             | Guideline                                                                                                |
| :----------------- | :------------------------------------------------------------------------------------------------------- |
| **Grid System**    | Likely uses a flexible grid system. Use consistent container widths (e.g., `container-large`, `container-medium`). |
| **Whitespace**     | Generous use of whitespace around elements and sections. Avoid clutter.                                    |
| **Padding/Margins**| Use consistent spacing units (e.g., REM or pixel equivalents based on a base unit like 8px). Sections have significant top/bottom padding. |
| **Responsiveness** | App must be fully responsive: Mobile-first or graceful degradation. Test on various screen sizes.          |
| **Alignment**      | Text often left-aligned for readability. Centered text for short headlines or specific design elements.    |
| **Vertical Rhythm**| Maintain consistent vertical spacing between text elements (headings, paragraphs).                         |

---

**IV. UI Components**

| Component         | Style & Behavior                                                                                                |
| :---------------- | :-------------------------------------------------------------------------------------------------------------- |
| **Buttons**       | - **Primary (Violet/Blue):** Solid background, white text, slight rounded corners, subtle hover (lift/darken). Text style varies, may include UPPERCASE. <br/> - **Secondary (White/Outline):** White background with colored text/border, or outline style. Hover effects. <br/> - **Tertiary/Text Links:** Underlined or color change on hover. |
| **Cards**         | - Clean, structured. Structured with clear hierarchy for image (if present), title, description, and action elements. <br/> - Consistent padding within cards. Subtle borders or shadows for depth. <br/> - Alternating background colors for card lists (e.g., white, light lavender). |
| **Forms**         | - Clean input fields, clear labels (above or placeholder). <br/> - Good contrast for input text and borders. <br/> - Clear focus states (e.g., `outline: 0.125rem solid #4d65ff`). <br/> - Validation messages should be clear and accessible. |
| **Navigation**    | - **Main Nav:** Clear, concise links (Poppins, text style varies). Dropdowns for sub-sections. <br/> - **Sur-Header Nav (if applicable):** Smaller, utility links (Open Sans). <br/> - **Mobile Nav:** Hamburger menu, clear slide-out or full-screen overlay. |
| **Modals/Pop-ups**| - Consistent styling with the rest of the app. Clear close mechanism. <br/> - Use sparingly for important information or actions. |
| **Footer**        | - Dark background (Navy/Charcoal) with white/light grey text. <br/> - Organized links, social media icons, copyright. |
| **Iconography**   | - Clean, modern, line-style or subtly filled SVG icons. <br/> - Consistent stroke weight and style. <br/> - Used for navigation cues, list item markers, social media, CTAs. |
| **Sliders/Carousels** | - Used for showcasing items like featured content or image galleries. Smooth transitions. Clear navigation (arrows/dots). |

---

**V. Imagery & Iconography**

| Type      | Guideline                                                                                                 |
| :-------- | :-------------------------------------------------------------------------------------------------------- |
| **Photography** | - High-quality, professional. <br/> - Focus on engagement and brand themes like "acceleration" and "impact." <br/> - Conceptual/Brand: Modern, abstract, or illustrative visuals. |
| **Illustrations** | If used, should be clean, modern, and align with the brand's professional yet dynamic feel. SVG preferred. |
| **Logos**   | - Brand/Feature logos displayed clearly. Ensure proper aspect ratio and padding.                          |
| **Icons**   | - SVG format preferred for scalability and crispness. <br/> - Style: Line icons, or simple filled icons. Consistent stroke weight. <br/> - Color: Use accent colors (Violet, Blue) or neutral greys. |

---

**VI. Interactivity & Animation**

| Element           | Guideline                                                                                                    |
| :---------------- | :----------------------------------------------------------------------------------------------------------- |
| **Hover States**  | - Links: Underline or color change. <br/> - Buttons: Subtle lift (e.g., `transform: translate3d(0, -2px, 0.01px)`), background/text color change, or border change. <br/> - Cards: Slight shadow increase or lift. |
| **Transitions**   | - Smooth and quick (e.g., `0.3s - 0.4s ease-out`). Avoid overly complex or slow animations.                     |
| **Page Loads**    | Consider subtle loading indicators if content takes time to load.                                              |
| **Scroll Effects**| Parallax or subtle reveal animations can be used sparingly for visual interest, but prioritize performance.    |

---

**VII. Accessibility (WCAG AA as a minimum target)**

| Aspect             | Guideline                                                                                                 |
| :----------------- | :-------------------------------------------------------------------------------------------------------- |
| **Color Contrast** | Ensure sufficient contrast between text and background colors (min 4.5:1 for normal, 3:1 for large text). |
| **Keyboard Nav**   | All interactive elements must be focusable and operable via keyboard. Clear focus indicators.              |
| **Semantic HTML**  | Use appropriate HTML5 tags for structure (nav, main, article, aside, header, footer, h1-h6, etc.).       |
| **ARIA Attributes**| Use ARIA roles and attributes where necessary to enhance accessibility for screen readers.                   |
| **Image Alt Text** | All meaningful images must have descriptive alt text. Decorative images should have empty alt (`alt=""`).      |
| **Form Labels**    | All form inputs must have associated labels.                                                              |

---

**Key Takeaways for Coder:**

1.  **Font Consistency:** Poppins for headings/emphasis, Open Sans for body.
2.  **Color Discipline:** Stick to the defined palette, especially the primary dark, violet accent, and blue accent.
3.  **Whitespace is Key:** Don't cram elements; allow for breathing room.
4.  **Responsive First:** Design and build with mobile and various screen sizes in mind from the start.
5.  **Interactive Feedback:** Provide clear visual feedback for user interactions (hovers, clicks, focus).
6.  **Component Reusability:** Build UI elements (buttons, cards) as reusable components for consistency.
7.  **Accessibility is not an afterthought:** Integrate accessibility practices throughout development.

---