export interface Project {
  no: string;
  title: string;
  body: string;
  tech: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Role {
  when: string;
  span: string;
  title: string;
  mode: string;
  blurb: string;
}

export interface Stat {
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: '7+', label: 'Years shipping' },
  { value: '1L+', label: 'Users served' },
  { value: '15+', label: 'Tenants, one system' },
  { value: '35%', label: 'Faster publishing' },
];

export const ABOUT: { lead: string; paras: [string, string] } = {
  lead: 'I like the unglamorous parts: the widget that loaded 20% too slow, the publishing flow nobody had timed, the multi-tenant role matrix everyone was scared of.',
  paras: [
    '7+ years building modern web applications with React.js and Next.js; led 2+ large-scale applications end to end, improving performance and user engagement.',
    'Extending frontend expertise into full-stack delivery — Node.js and Express services, MongoDB, Python APIs — plus the DevOps and AI-assisted tooling around them.',
  ],
};

export const PROJECTS: Project[] = [
  {
    no: '01',
    title: 'CRM-based Web Application',
    body: 'Developed end-to-end features like chat, chatbot, e-commerce modules, drag-and-drop email & form builders, and custom analytics, while also maintaining Node.js (Express) services and MongoDB — cut chat widget load time by 20%',
    tech: ['Next.js', 'React.js', 'Ant Design', 'Material UI', 'SCSS', 'REST API', 'Node.js', 'Express', 'MongoDB'],
  },
  {
    no: '02',
    title: 'CMS-based Web Application',
    body: 'Built a flexible content management platform with drag-and-drop functionality; handled AWS S3 uploads, real-time sync with sockets, and customized third-party plugins like react-beautiful-dnd, cutting content publishing time by 35%',
    tech: ['React.js', 'Hooks', 'Ant Design', 'AWS SDK', 'SCSS', 'REST API'],
  },
  {
    no: '03',
    title: 'Incentive Management & Rebate Optimization Platform',
    body: 'Architected a multi-tenant system supporting 15+ tenants with complex role-based restrictions and an optimized user interface; developed E2E features, rich-text editing, and interactive charts',
    tech: ['Next.js', 'Radix UI', 'TailwindCSS', 'TypeScript', 'Highcharts', 'Recharts', 'SWR', 'React-Quill'],
  },
  {
    no: '04',
    title: 'Authenticated Dashboard Application',
    body: 'Built data-driven dashboards with various charts (bar, pie, geo) within strict timelines, serving 1L+ users with 1–2 sec load times',
    tech: ['React.js', 'Hooks', 'Bootstrap', 'SCSS', 'JavaScript', 'REST API', 'Highcharts', 'Recharts'],
  },
];

export const SKILLS: SkillGroup[] = [
  { label: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'JSON', 'REST API'] },
  {
    label: 'Frameworks / Libraries',
    items: ['React.js', 'Next.js', 'Redux', 'Redux-Saga', 'Redux-Thunk', 'Ant Design', 'Material UI', 'Tailwind', 'Bootstrap', 'Styled-Components', 'SCSS'],
  },
  { label: 'Backend', items: ['Node.js', 'Express.js', 'MongoDB', 'Python (Flask/FastAPI)'] },
  {
    label: 'AI-Assisted Development',
    items: ['Python & Node.js AI tooling', 'LLM-integrated pipelines', 'Claude Code workflows', 'prompt/token optimization', 'agentic task automation'],
  },
  {
    label: 'DevOps',
    items: ['AWS (S3, Amplify, CloudFront, CodePipeline, CodeBuild, IAM)', 'Cloudflare (Tunnel, Zero Trust, DNS)', 'Bunny CDN', 'IIS', 'Docker & Docker Compose', 'Nginx', 'Linux (Debian) administration', 'restic backup/DR'],
  },
  { label: 'Project Management / VCS', items: ['Jira', 'Trello', 'Git', 'Bitbucket', 'GitHub', 'GitLab'] },
];

export const ROLES: Role[] = [
  { when: 'Apr 2022 — Present', span: '4 yrs 6 mos', title: 'Senior Developer', mode: 'Full-time · Hybrid', blurb: 'Karur, Tamil Nadu, India. React.js, TypeScript and +28 skills.' },
  { when: 'Oct 2020 — Mar 2022', span: '1 yr 6 mos', title: 'Developer', mode: 'Full-time · On-site', blurb: 'Karur, Tamil Nadu, India. React.js, Next.js and +17 skills.' },
  { when: 'Jul 2019 — Sep 2020', span: '1 yr 3 mos', title: 'Developer Trainee', mode: 'Full-time · On-site', blurb: 'Karur, Tamil Nadu. React.js, Redux.js and +11 skills.' },
  { when: 'Feb 2019 — Jul 2019', span: '6 mos', title: 'Frontend Web Developer', mode: 'Internship', blurb: 'Karur, Tamil Nadu, India.' },
];

export const NOW: { lead: string; note: string } = {
  lead: 'Deeper into full-stack and AI-assisted delivery, and open to senior frontend roles where performance is a feature, not a ticket.',
  note: 'Writing: nothing published yet. When there is, it lands here.',
};

export const CONTACT: { email: string; linkedin: string; github: string } = {
  email: 'rajeshkumarrkgm@gmail.com',
  linkedin: 'https://www.linkedin.com/in/rajesh-kumar-kgm',
  github: 'https://github.com/Rajesh-kumar-r',
};

export const EXPERIENCE_META: { company: string; total: string; location: string } = {
  company: 'Mallow Technologies Private Limited',
  total: '7 yrs 8 mos',
  location: 'Karur, Tamil Nadu, India',
};
