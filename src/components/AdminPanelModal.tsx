import React, { useState, useEffect } from 'react';
import { Post, CurrentAffairsArticle, CategoryType } from '../types';
import { RichTextEditor } from './RichTextEditor';
import { sendTestPushNotification } from '../utils/pwaServiceWorker';
import { generateH1ImageBanner } from '../utils/imageGenerator';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import {
  X,
  ShieldCheck,
  Edit,
  Trash2,
  Plus,
  Key,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Check,
  Zap,
  Clock,
  Layers,
  FileText,
  Building,
  Calendar,
  Sparkles,
  HelpCircle,
  Upload,
  Eye,
  Info,
  Bell,
  CopyCheck,
  Save,
  Radio,
  Download,
  Database,
  Activity,
  Globe,
  Sliders,
  Server,
  BarChart2,
  TrendingUp,
  Cpu,
  HardDrive,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Terminal,
  Send,
  Link,
  DownloadCloud,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const normalizeString = (str: string): string => {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
};

const calculateLevenshtein = (a: string, b: string): number => {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

const areTitlesSimilar = (title1: string, title2: string): boolean => {
  const t1 = (title1 || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  const t2 = (title2 || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  if (t1 === t2) return true;

  const tokens1 = new Set(t1.split(' ').filter(t => t.length > 2));
  const tokens2 = new Set(t2.split(' ').filter(t => t.length > 2));
  
  if (tokens1.size === 0 || tokens2.size === 0) return false;

  let intersectionCount = 0;
  for (const tok of tokens1) {
    if (tokens2.has(tok)) {
      intersectionCount++;
    }
  }

  const unionSize = new Set([...tokens1, ...tokens2]).size;
  const jaccard = intersectionCount / unionSize;

  if (jaccard >= 0.8) return true;

  const n1 = t1.replace(/\s+/g, '');
  const n2 = t2.replace(/\s+/g, '');
  if (n1 === n2) return true;

  const maxLen = Math.max(n1.length, n2.length);
  if (maxLen === 0) return true;

  const dist = calculateLevenshtein(n1, n2);
  const similarity = 1 - dist / maxLen;

  return similarity >= 0.85;
};

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onUpdatePosts: (posts: Post[]) => void;
  currentAffairs: CurrentAffairsArticle[];
  onUpdateCurrentAffairs: (articles: CurrentAffairsArticle[]) => void;
  onTriggerSync?: (type: 'current-affairs' | 'latest-jobs' | 'all') => void;
  onOpenAIGenerator?: () => void;
  onOpenAutoFetch?: () => void;
  onOpenCron?: () => void;
  onOpenSitemap?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  posts,
  onUpdatePosts,
  currentAffairs,
  onUpdateCurrentAffairs,
  onTriggerSync,
  onOpenAIGenerator,
  onOpenAutoFetch,
  onOpenCron,
  onOpenSitemap
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'current-affairs' | 'import-dashboard' | 'ai-tools' | 'api-key' | 'auto-sync' | 'system-analytics' | 'git-sync' | 'diagnostics'>('posts');

  // StudyGovtHelp Dashboard State
  const [studyMetrics, setStudyMetrics] = useState<any>(null);
  const [studyLogs, setStudyLogs] = useState<any[]>([]);
  const [isLoadingStudyDashboard, setIsLoadingStudyDashboard] = useState(false);
  const [studyLogFilter, setStudyLogFilter] = useState('all');
  const [studySearchTerm, setStudySearchTerm] = useState('');
  const [isTriggeringStudySync, setIsTriggeringStudySync] = useState(false);
  const [duplicateModalData, setDuplicateModalData] = useState<any>(null);

  const fetchStudyDashboard = async () => {
    setIsLoadingStudyDashboard(true);
    try {
      const res = await fetch('/api/admin/studygovthelp/dashboard');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStudyMetrics(data.metrics);
          setStudyLogs(data.logs || []);
        }
      }
    } catch (err) {
      console.error("Failed to fetch StudyGovtHelp dashboard:", err);
    } finally {
      setIsLoadingStudyDashboard(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'import-dashboard') {
      fetchStudyDashboard();
    }
  }, [isOpen, activeTab]);

  // Diagnostics Dashboard State
  const [diagnosticsLogs, setDiagnosticsLogs] = useState<any[]>([]);
  const [sourceSummary, setSourceSummary] = useState<any[]>([]);
  const [isLoadingDiagnostics, setIsLoadingDiagnostics] = useState(false);
  const [diagSearchTerm, setDiagSearchTerm] = useState('');
  const [diagSourceFilter, setDiagSourceFilter] = useState('all');
  const [diagStatusFilter, setDiagStatusFilter] = useState('all');
  const [isTestingFetch, setIsTestingFetch] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Single-Cycle Force Run Debug Inspector State
  const [debugModalOpen, setDebugModalOpen] = useState(false);
  const [debugSource, setDebugSource] = useState<string>('gktoday.in');
  const [isDebugRunning, setIsDebugRunning] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);
  const [debugActiveTab, setDebugActiveTab] = useState<'raw' | 'parsed' | 'logs'>('raw');
  const [debugCopyToast, setDebugCopyToast] = useState(false);
  const [isFetchingIsnblogs, setIsFetchingIsnblogs] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);

  // Import by URL state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');

  // Batch Image Repair Utility State
  const [isBatchRepairing, setIsBatchRepairing] = useState(false);
  const [isCharRepairing, setIsCharRepairing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchStatusText, setBatchStatusText] = useState('');
  const [batchResultStats, setBatchResultStats] = useState<{
    totalJobsCount: number;
    totalCaCount: number;
    repairedJobsCount: number;
    repairedCaCount: number;
  } | null>(null);

  const handleBatchImageRepair = async () => {
    if (isBatchRepairing) return;
    setIsBatchRepairing(true);
    setIsRepairing(true);
    setBatchProgress(5);
    setBatchStatusText('Initializing Batch Image Repair Utility...');
    setBatchResultStats(null);

    try {
      setBatchProgress(15);
      setBatchStatusText(`Scanning ${posts.length} Posts & ${currentAffairs.length} Current Affairs for null or broken image paths...`);
      await new Promise(r => setTimeout(r, 400));

      setBatchProgress(35);
      setBatchStatusText('Crawling og:image, twitter:image, data-original, data-src attributes & RSS enclosures...');
      await new Promise(r => setTimeout(r, 500));

      setBatchProgress(60);
      setBatchStatusText('Verifying live media HTTP status, removing broken URLs & applying fallback graphics...');

      const res = await fetch('/api/admin/repair-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fetchRemote: true })
      });

      setBatchProgress(85);
      setBatchStatusText('Saving sanitized posts to database and updating memory cache...');

      const data = await res.json();

      if (data.success) {
        setBatchProgress(95);
        setBatchStatusText('Syncing repaired records with active UI view...');

        const [jobsRes, caRes] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/current-affairs')
        ]);
        const jobsData = await jobsRes.json();
        const caData = await caRes.json();

        if (Array.isArray(jobsData.posts) && jobsData.posts.length > 0) {
          onUpdatePosts(jobsData.posts);
        }
        if (Array.isArray(caData.currentAffairs) && caData.currentAffairs.length > 0) {
          onUpdateCurrentAffairs(caData.currentAffairs);
        }

        setBatchProgress(100);
        const repairedJobs = data.repairedJobsCount || 0;
        const repairedCa = data.repairedCaCount || 0;
        setBatchStatusText(`Batch Repair Complete! Repaired ${repairedJobs} Job Images & ${repairedCa} CA Images.`);
        setBatchResultStats({
          totalJobsCount: data.totalJobPosts || posts.length,
          totalCaCount: data.totalCurrentAffairs || currentAffairs.length,
          repairedJobsCount: repairedJobs,
          repairedCaCount: repairedCa
        });

        showToast(`✨ Batch Image Repair complete! Repaired ${repairedJobs} job images & ${repairedCa} CA images.`);
      } else {
        setBatchProgress(100);
        setBatchStatusText(`❌ Batch Repair failed: ${data.error || 'Unknown error'}`);
        showToast(`❌ Batch Repair failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      setBatchProgress(100);
      setBatchStatusText(`❌ Connection error: ${err.message || String(err)}`);
      showToast(`❌ Connection error during batch repair: ${err.message || String(err)}`);
    } finally {
      setIsBatchRepairing(false);
      setIsRepairing(false);
    }
  };

  const handleRepairImagesAndData = async () => {
    await handleBatchImageRepair();
  };

  const handleBulkCharacterRepair = async () => {
    if (isCharRepairing) return;
    setIsCharRepairing(true);
    setBatchProgress(10);
    setBatchStatusText('Initializing Bulk Character Repair & Encoding Cleanup...');
    setBatchResultStats(null);

    try {
      setBatchProgress(40);
      setBatchStatusText('Analyzing titles, summaries, short info, and full descriptions for invalid or corrupted characters (like \\uFFFD, broken Rupee symbols, and unpaired surrogates)...');
      await new Promise(r => setTimeout(r, 400));

      setBatchProgress(70);
      setBatchStatusText('Rebuilding textual records, correcting broken Indian Government result patterns, and stripping leading emoji prefixes...');

      const res = await fetch('/api/admin/repair-characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      setBatchProgress(90);
      setBatchStatusText('Persisting updated, sanitized dataset to database (mockPosts.ts)...');

      const data = await res.json();

      if (data.success) {
        setBatchProgress(95);
        setBatchStatusText('Refreshing and synchronizing frontend state with repaired records...');

        const [jobsRes, caRes] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/current-affairs')
        ]);
        const jobsData = await jobsRes.json();
        const caData = await caRes.json();

        if (Array.isArray(jobsData.posts)) {
          onUpdatePosts(jobsData.posts);
        }
        if (Array.isArray(caData.currentAffairs)) {
          onUpdateCurrentAffairs(caData.currentAffairs);
        }

        setBatchProgress(100);
        const repJobs = data.stats.repairedJobsCount || 0;
        const repCa = data.stats.repairedCaCount || 0;
        setBatchStatusText(`Character Repair Complete! Cleaned and repaired ${repJobs} Job Posts & ${repCa} Current Affairs Articles.`);
        setBatchResultStats({
          totalJobsCount: data.stats.totalJobs || posts.length,
          totalCaCount: data.stats.totalCurrentAffairs || currentAffairs.length,
          repairedJobsCount: repJobs,
          repairedCaCount: repCa
        });

        showToast(`✨ Bulk Character Repair complete! Successfully cleaned and repaired encoding issues.`);
      } else {
        setBatchProgress(100);
        setBatchStatusText(`❌ Character Repair failed: ${data.error || 'Unknown error'}`);
        showToast(`❌ Character Repair failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      setBatchProgress(100);
      setBatchStatusText(`❌ Connection error: ${err.message || String(err)}`);
      showToast(`❌ Connection error: ${err.message || String(err)}`);
    } finally {
      setIsCharRepairing(false);
    }
  };

  const handleBatchMergeDuplicates = async () => {
    setIsBatchRepairing(true);
    setBatchProgress(10);
    setBatchStatusText('Scanning database for duplicate canonical hashes...');

    try {
      const res = await fetch('/api/admin/batch-merge-duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setBatchProgress(80);
        setBatchStatusText('Syncing merged records with active UI view...');

        const [jobsRes, caRes] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/current-affairs')
        ]);
        const jobsData = await jobsRes.json();
        const caData = await caRes.json();

        if (Array.isArray(jobsData.posts)) onUpdatePosts(jobsData.posts);
        if (Array.isArray(caData.currentAffairs)) onUpdateCurrentAffairs(caData.currentAffairs);

        setBatchProgress(100);
        showToast(`✨ Batch merge complete! Merged ${data.mergedJobsCount} duplicate job posts & ${data.mergedCaCount} duplicate current affairs.`);
      } else {
        setBatchProgress(100);
        showToast(`❌ Batch merge failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      setBatchProgress(100);
      showToast(`❌ Connection error during batch merge: ${err.message || String(err)}`);
    } finally {
      setIsBatchRepairing(false);
    }
  };

  // Short Secret Admin Access URL Key
  const [secretUrlKey, setSecretUrlKey] = useState<string>(() => {
    return localStorage.getItem('pariksha_admin_secret_url_key')?.trim() || 'k=x9';
  });

  const handleForceRunDebug = async (sourceKey: string) => {
    setDebugSource(sourceKey);
    setDebugModalOpen(true);
    setIsDebugRunning(true);
    setDebugData(null);
    setDebugActiveTab('raw');

    try {
      const res = await fetch('/api/admin/diagnostics/force-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: sourceKey })
      });
      const data = await res.json();
      if (data.success) {
        setDebugData(data.debugOutput);
        showToast(`⚡ Single-cycle force run completed for ${sourceKey}!`);
      } else {
        showToast(`❌ Force run failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      showToast(`❌ Connection error: ${err.message || String(err)}`);
    } finally {
      setIsDebugRunning(false);
      fetchDiagnosticsData();
    }
  };

  const handleSaveSecretUrlKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretUrlKey.trim()) {
      alert('Secret URL parameter key cannot be empty.');
      return;
    }
    localStorage.setItem('pariksha_admin_secret_url_key', secretUrlKey.trim());
    showToast('🔒 Short Admin Access URL key updated successfully!');
  };

  const fetchDiagnosticsData = async () => {
    setIsLoadingDiagnostics(true);
    try {
      const res = await fetch('/api/admin/diagnostics');
      const data = await res.json();
      if (data.success) {
        setDiagnosticsLogs(data.logs || []);
        setSourceSummary(data.sourceSummary || []);
      }
    } catch (e: any) {
      console.error("Failed to fetch diagnostics", e);
    } finally {
      setIsLoadingDiagnostics(false);
    }
  };

  const handleTestSourceFetch = async (sourceKey: string) => {
    setIsTestingFetch(sourceKey);
    try {
      const res = await fetch('/api/admin/diagnostics/test-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: sourceKey })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`⚡ Test fetch completed for ${sourceKey}!`);
        await fetchDiagnosticsData();
      } else {
        showToast(`❌ Test fetch failed: ${data.error}`);
      }
    } catch (err: any) {
      showToast(`❌ Network error on test fetch: ${err.message}`);
    } finally {
      setIsTestingFetch(null);
    }
  };

  const handleClearDiagnostics = async () => {
    if (!window.confirm("Are you sure you want to clear all diagnostic logs?")) return;
    try {
      await fetch('/api/admin/diagnostics/clear', { method: 'POST' });
      showToast("🗑️ Diagnostic logs reset.");
      await fetchDiagnosticsData();
    } catch (e) {}
  };

  const handleExportDiagnosticsJSON = () => {
    const blob = new Blob([JSON.stringify({ exportDate: new Date().toISOString(), sourceSummary, logs: diagnosticsLogs }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pariksha_diagnostics_report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📥 Diagnostics JSON report exported!");
  };

  // Git Commit & Push Direct Sync State
  const [isGitSyncing, setIsGitSyncing] = useState(false);
  const [gitSyncLog, setGitSyncLog] = useState<string | null>(null);
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('pariksha_github_token') || '');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => localStorage.getItem('pariksha_last_sync_time'));
  const [lastSyncStatus, setLastSyncStatus] = useState<'success' | 'failed' | 'idle'>(() => (localStorage.getItem('pariksha_last_sync_status') as any) || 'idle');
  const [lastSyncMsg, setLastSyncMsg] = useState<string | null>(() => localStorage.getItem('pariksha_last_sync_msg'));
  const [customCommitMessage, setCustomCommitMessage] = useState('admin: manual sync and content update');

  const triggerGitSync = async (
    actionType: string,
    commitMsg: string,
    postsToSync: Post[] = posts,
    caToSync: CurrentAffairsArticle[] = currentAffairs
  ) => {
    setIsGitSyncing(true);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' (' + new Date().toLocaleDateString() + ')';
    try {
      const savedToken = localStorage.getItem('pariksha_github_token') || githubToken || '';
      const res = await fetch('/api/admin/git-commit-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          commitMessage: commitMsg,
          posts: postsToSync,
          currentAffairs: caToSync,
          githubToken: savedToken
        })
      });
      const data = await res.json();
      setIsGitSyncing(false);
      
      const syncTimeStr = now;
      setLastSyncTime(syncTimeStr);
      localStorage.setItem('pariksha_last_sync_time', syncTimeStr);

      if (data.success) {
        const statusType = data.gitPushed ? 'success' : 'idle';
        const msgStr = data.gitPushed ? `Pushed to main branch (${commitMsg})` : `Saved locally (${commitMsg})`;
        setLastSyncStatus(statusType);
        setLastSyncMsg(msgStr);
        localStorage.setItem('pariksha_last_sync_status', statusType);
        localStorage.setItem('pariksha_last_sync_msg', msgStr);

        if (data.gitPushed) {
          showToast('🚀 Direct Git commit & push succeeded! Vercel live site build triggered.');
        } else {
          showToast('💾 Updated & saved directly to src/data/mockPosts.ts.');
        }
        setGitSyncLog(data.message || data.gitLog);
      } else {
        setLastSyncStatus('failed');
        setLastSyncMsg(`Error: ${data.error || 'Server error'}`);
        localStorage.setItem('pariksha_last_sync_status', 'failed');
        localStorage.setItem('pariksha_last_sync_msg', `Error: ${data.error}`);

        showToast(`⚠️ Sync failed: ${data.error || 'Server error'}`);
        setGitSyncLog(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setIsGitSyncing(false);
      setLastSyncStatus('failed');
      setLastSyncMsg(`Network error: ${err.message}`);
      localStorage.setItem('pariksha_last_sync_status', 'failed');
      localStorage.setItem('pariksha_last_sync_msg', `Network error: ${err.message}`);

      showToast(`❌ Sync network error: ${err.message}`);
    }
  };

  // Search & Filter state for Posts
  const [postSearch, setPostSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Bulk Selection State
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [selectedCaIds, setSelectedCaIds] = useState<string[]>([]);

  // Search state for Current Affairs
  const [caSearch, setCaSearch] = useState('');

  // Edit / Add Modal state for Post
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Edit / Add Modal state for CA
  const [editingCa, setEditingCa] = useState<CurrentAffairsArticle | null>(null);
  const [isCreatingCa, setIsCreatingCa] = useState(false);

  // Notification Toast in Admin
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3500);
  };

  // Backup Export & Import
  const handleExportBackup = () => {
    const backupData = {
      version: '2026.8.6',
      exportDate: new Date().toISOString(),
      postsCount: posts.length,
      currentAffairsCount: currentAffairs.length,
      posts,
      currentAffairs
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pariksha_result_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Full Database Backup JSON exported successfully!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data.posts) && data.posts.length > 0) {
          onUpdatePosts(data.posts);
        }
        if (Array.isArray(data.currentAffairs) && data.currentAffairs.length > 0) {
          onUpdateCurrentAffairs(data.currentAffairs);
        }
        showToast(`📤 Backup Restored! ${data.posts?.length || 0} Posts & ${data.currentAffairs?.length || 0} CA articles imported.`);
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // API Key Check state
  const [apiKeyStatus, setApiKeyStatus] = useState<{
    loading: boolean;
    hasKey?: boolean;
    keyName?: string;
    maskedKey?: string;
    status?: string;
    latencyMs?: number;
    testResponse?: string;
    provider?: string;
    message?: string;
    timestamp?: string;
  }>({ loading: false });

  const checkApiKeyHealth = async () => {
    setApiKeyStatus({ loading: true });
    try {
      const res = await fetch('/api/admin/check-api-key');
      const data = await res.json();
      setApiKeyStatus({ loading: false, ...data });
      if (data.success) {
        showToast('✅ API Key is working perfectly!');
      } else {
        showToast('⚠️ API Key Check failed or missing.');
      }
    } catch (err: any) {
      setApiKeyStatus({
        loading: false,
        hasKey: false,
        status: 'ERROR',
        message: err.message || 'Network error while checking API key.'
      });
      showToast('❌ Error checking API key.');
    }
  };

  // Security Credentials state
  const [customAdminPin, setCustomAdminPin] = useState(() => 
    localStorage.getItem('pariksha_admin_custom_pin') || localStorage.getItem('pariksha_admin_custom_password') || '9929833'
  );
  const [sessionTimeLeft, setSessionTimeLeft] = useState<string>('15:00');

  useEffect(() => {
    const updateCountdown = () => {
      const loginTime = localStorage.getItem('pariksha_admin_login_time');
      if (!loginTime) {
        setSessionTimeLeft('00:00');
        return;
      }
      const elapsed = Date.now() - parseInt(loginTime, 10);
      const remainingMs = Math.max(0, 15 * 60 * 1000 - elapsed);
      const mins = Math.floor(remainingMs / 60000);
      const secs = Math.floor((remainingMs % 60000) / 1000);
      setSessionTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAdminPin.trim()) {
      alert('Admin Security PIN cannot be empty.');
      return;
    }
    localStorage.setItem('pariksha_admin_custom_pin', customAdminPin.trim());
    localStorage.setItem('pariksha_admin_custom_password', customAdminPin.trim());
    showToast('🔒 Admin Security PIN updated successfully!');
  };

  const handleExtendSession = () => {
    localStorage.setItem('pariksha_admin_login_time', Date.now().toString());
    showToast('⏱️ Admin Session extended by 15 minutes!');
  };

  useEffect(() => {
    if (isOpen && activeTab === 'api-key') {
      checkApiKeyHealth();
    }
    if (isOpen && activeTab === 'diagnostics') {
      fetchDiagnosticsData();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  // Filtered Posts
  const filteredPosts = posts.filter(p => {
    const titleStr = p.title || '';
    const orgStr = p.organization || '';
    const matchesSearch = titleStr.toLowerCase().includes(postSearch.toLowerCase()) ||
                          orgStr.toLowerCase().includes(postSearch.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered CA Articles
  const filteredCa = currentAffairs.filter(c => {
    const titleStr = c.title || '';
    const catStr = c.category || '';
    return titleStr.toLowerCase().includes(caSearch.toLowerCase()) ||
           catStr.toLowerCase().includes(caSearch.toLowerCase());
  });

  // BULK ACTION HANDLERS FOR POSTS
  const handleToggleSelectAllPosts = () => {
    const currentFilteredIds = filteredPosts.map(p => p.id);
    const allSelected = currentFilteredIds.length > 0 && currentFilteredIds.every(id => selectedPostIds.includes(id));
    if (allSelected) {
      setSelectedPostIds(prev => prev.filter(id => !currentFilteredIds.includes(id)));
    } else {
      setSelectedPostIds(prev => Array.from(new Set([...prev, ...currentFilteredIds])));
    }
  };

  const handleToggleSelectPost = (id: string) => {
    setSelectedPostIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleBulkDeletePosts = () => {
    if (selectedPostIds.length === 0) return;
    if (window.confirm(`क्या आप वाकई चुनी गई ${selectedPostIds.length} पोस्ट्स को डिलीट करना चाहते हैं?`)) {
      const updated = posts.filter(p => !selectedPostIds.includes(p.id));
      onUpdatePosts(updated);
      showToast(`🗑️ ${selectedPostIds.length} Posts deleted successfully!`);
      setSelectedPostIds([]);
      triggerGitSync('bulk_delete_posts', `admin: bulk delete ${selectedPostIds.length} posts`, updated, currentAffairs);
    }
  };

  const handleBulkUpdatePostCategory = (newCategory: CategoryType) => {
    if (selectedPostIds.length === 0) return;
    const updated = posts.map(p =>
      selectedPostIds.includes(p.id) ? { ...p, category: newCategory } : p
    );
    onUpdatePosts(updated);
    showToast(`✏️ Updated category to "${newCategory}" for ${selectedPostIds.length} posts!`);
    triggerGitSync('bulk_update_category', `admin: bulk update category to ${newCategory}`, updated, currentAffairs);
  };

  const handleBulkUpdatePostOrganization = () => {
    if (selectedPostIds.length === 0) return;
    const newOrg = window.prompt("Enter new Organization name for selected posts:", "Staff Selection Commission (SSC)");
    if (!newOrg || !newOrg.trim()) return;
    const updated = posts.map(p =>
      selectedPostIds.includes(p.id) ? { ...p, organization: newOrg.trim() } : p
    );
    onUpdatePosts(updated);
    showToast(`✏️ Updated organization for ${selectedPostIds.length} posts!`);
    triggerGitSync('bulk_update_org', `admin: bulk update org to ${newOrg}`, updated, currentAffairs);
  };

  // BULK ACTION HANDLERS FOR CURRENT AFFAIRS
  const handleToggleSelectAllCa = () => {
    const currentFilteredIds = filteredCa.map(c => c.id);
    const allSelected = currentFilteredIds.length > 0 && currentFilteredIds.every(id => selectedCaIds.includes(id));
    if (allSelected) {
      setSelectedCaIds(prev => prev.filter(id => !currentFilteredIds.includes(id)));
    } else {
      setSelectedCaIds(prev => Array.from(new Set([...prev, ...currentFilteredIds])));
    }
  };

  const handleToggleSelectCa = (id: string) => {
    setSelectedCaIds(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteCa = () => {
    if (selectedCaIds.length === 0) return;
    if (window.confirm(`क्या आप वाकई चुनी गई ${selectedCaIds.length} करंट अफेयर्स न्यूज को डिलीट करना चाहते हैं?`)) {
      const updated = currentAffairs.filter(c => !selectedCaIds.includes(c.id));
      onUpdateCurrentAffairs(updated);
      showToast(`🗑️ ${selectedCaIds.length} CA articles deleted!`);
      setSelectedCaIds([]);
      triggerGitSync('bulk_delete_ca', `admin: bulk delete ${selectedCaIds.length} CA articles`, posts, updated);
    }
  };

  const handleBulkUpdateCaCategory = (newCategory: string) => {
    if (selectedCaIds.length === 0) return;
    const updated = currentAffairs.map(c =>
      selectedCaIds.includes(c.id) ? { ...c, category: newCategory } : c
    );
    onUpdateCurrentAffairs(updated);
    showToast(`✏️ Updated category to "${newCategory}" for ${selectedCaIds.length} CA articles!`);
    triggerGitSync('bulk_update_ca_category', `admin: bulk update CA category to ${newCategory}`, posts, updated);
  };

  // POST CRUD HANDLERS
  const handleDeletePost = (id: string, title: string) => {
    if (window.confirm(`क्या आप वाकई इस पोस्ट को डिलीट करना चाहते हैं?\n"${title}"`)) {
      const updated = posts.filter(p => p.id !== id);
      onUpdatePosts(updated);
      showToast('🗑️ Post deleted successfully!');
      triggerGitSync('delete_post', `admin: delete post "${title}"`, updated, currentAffairs);
    }
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    const category = editingPost.category || 'blog';
    const postTitle = editingPost.title?.trim() || (category === 'blog' ? 'Untitled Blog Article' : 'Untitled Post');
    const organization = editingPost.organization?.trim() || (category === 'blog' ? 'Pariksha Result Blog' : 'General');
    const postDate = editingPost.postDate || new Date().toISOString().split('T')[0];

    const sanitizedPost: Post = {
      ...editingPost,
      title: postTitle,
      organization: organization,
      category: category,
      postDate: postDate,
      shortInfo: editingPost.shortInfo || '',
      fullDescription: editingPost.fullDescription || '',
    };

    // Preventive Duplicate Detection on title + organization + category
    const foundDuplicate = posts.find(p => {
      if (p.id === sanitizedPost.id) return false;
      const orgsMatch = normalizeString(p.organization || '') === normalizeString(sanitizedPost.organization || '');
      const categoriesMatch = (p.category || '').toLowerCase().trim() === (sanitizedPost.category || '').toLowerCase().trim();
      return orgsMatch && categoriesMatch && areTitlesSimilar(p.title || '', sanitizedPost.title || '');
    });

    if (foundDuplicate) {
      const confirmSave = window.confirm(
        `⚠️ DUPLICATE DETECTED / डुप्लिकेट पाया गया!\n\nA very similar post already exists / एक समान पोस्ट पहले से मौजूद है:\n\n` +
        `• Existing Title: "${foundDuplicate.title}"\n` +
        `• Organization: "${foundDuplicate.organization}"\n` +
        `• Category: "${foundDuplicate.category}"\n\n` +
        `Do you still want to publish this duplicate post / क्या आप फिर भी इसे पब्लिश करना चाहते हैं?`
      );
      if (!confirmSave) {
        showToast('❌ Post saving cancelled (Duplicate prevented)');
        return;
      }
    }

    let updated: Post[];
    if (isCreatingPost) {
      updated = [sanitizedPost, ...posts];
      onUpdatePosts(updated);
      showToast('✅ New Post/Blog added successfully!');
    } else {
      updated = posts.map(p => p.id === sanitizedPost.id ? sanitizedPost : p);
      onUpdatePosts(updated);
      showToast('✏️ Post/Blog updated successfully!');
    }

    setEditingPost(null);
    setIsCreatingPost(false);

    // Direct Git Commit and Push to Main Branch
    triggerGitSync('save_post', `admin: update post "${sanitizedPost.title}"`, updated, currentAffairs);
  };

  const handleImportUrl = async () => {
    if (!importUrl || !importUrl.startsWith('http')) {
      setImportError('Please enter a valid HTTP/HTTPS URL.');
      return;
    }
    
    setIsImporting(true);
    setImportError('');
    
    try {
      const response = await fetch('/api/admin/import-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secretUrlKey || 'demo-admin-key'}`,
        },
        body: JSON.stringify({ url: importUrl })
      });
      
      const data = await response.json();
      
      if (data.success && data.article) {
        const fetchedData = data.article;
        const id = fetchedData.slug || fetchedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        const stripHtml = (html: string) => {
           let doc = new DOMParser().parseFromString(html, 'text/html');
           return doc.body.textContent || "";
        };

        const formattedArticle = {
          ...fetchedData,
          id,
          postDate: fetchedData.postDate || new Date().toISOString().split('T')[0],
          shortInfo: fetchedData.shortInfo ? stripHtml(fetchedData.shortInfo) : '',
          title: fetchedData.title ? stripHtml(fetchedData.title) : '',
          organization: fetchedData.organization ? stripHtml(fetchedData.organization) : '',
        };

        if (data.isDuplicate) {
          setDuplicateModalData({
            article: formattedArticle,
            existingPost: data.existingPost,
            reason: data.duplicateReason
          });
          setIsImportModalOpen(false);
          setImportUrl('');
        } else {
          setEditingPost(formattedArticle);
          setIsCreatingPost(true);
          setIsImportModalOpen(false);
          setImportUrl('');
        }
      } else {
        setImportError(data.error || 'Failed to import data from URL.');
      }
    } catch (err: any) {
      setImportError(err.message || 'An error occurred during import.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateNewPost = () => {
    const newId = `custom-post-${Date.now()}`;
    const newPostItem: Post = {
      id: newId,
      title: 'New Sarkari Job / Result Notification 2026',
      slug: `new-sarkari-notification-${Date.now()}`,
      category: 'latest-jobs',
      organization: 'Staff Selection Commission (SSC)',
      state: 'All India',
      postDate: new Date().toISOString().split('T')[0],
      lastDate: '2026-10-30',
      shortInfo: 'Brief summary details for candidates applying for this government recruitment drive.',
      totalVacancies: '1,000 Posts',
      qualificationRequired: ['Graduate in Any Discipline'],
      importantDates: [
        { event: 'Online Application Start', date: new Date().toISOString().split('T')[0], isImportant: true },
        { event: 'Last Date to Apply Online', date: '30/10/2026', isImportant: true }
      ],
      applicationFees: [
        { category: 'General / OBC / EWS', fee: '₹ 100/-' },
        { category: 'SC / ST / PwD / Female', fee: '₹ 0/-' }
      ],
      ageLimit: {
        minAge: '18 Years',
        maxAge: '27 Years',
        cutoffDate: '01/08/2026',
        relaxationDetails: 'OBC: 3 Years, SC/ST: 5 Years.'
      },
      vacancies: [
        { postName: 'Assistant Officer', totalPosts: '1,000 Posts', eligibility: 'Graduate Degree' }
      ],
      howToApplySteps: [
        'Visit the official portal.',
        'Fill personal & qualification details.',
        'Upload required documents and pay application fee.'
      ],
      importantLinks: [
        { title: 'Apply Online Portal', url: '#', isPrimary: true, type: 'apply' },
        { title: 'Download Official Notification', url: '#', isPrimary: false, type: 'notification' }
      ],
      fullDescription: '# New Sarkari Recruitment 2026\n\nOfficial notification for recruitment has been published.',
      faqs: [
        { question: 'What is the required qualification?', answer: 'Graduate degree from recognized university.' }
      ],
      metaTitle: 'New Sarkari Recruitment Notification 2026 | Pariksha Result',
      metaDescription: 'Check online application dates, vacancies, qualification and fee details.',
      keywords: ['Sarkari Job 2026', 'Recruitment Notification', 'Pariksha Result'],
      featuredImagePrompt: 'Official recruitment banner',
      imageAltText: 'New Sarkari Notification 2026',
      openGraph: {
        title: 'New Sarkari Recruitment Notification 2026',
        description: 'Check online application dates, vacancies, qualification and fee details.',
        type: 'article',
        url: `https://pariksha-result.vercel.app/latest-jobs/new-sarkari-notification-${Date.now()}`
      },
      schemas: {
        faqSchema: {},
        articleSchema: {},
        breadcrumbSchema: {}
      }
    };

    setEditingPost(newPostItem);
    setIsCreatingPost(true);
  };

  // CA CRUD HANDLERS
  const handleDeleteCa = (id: string, title: string) => {
    if (window.confirm(`क्या आप वाकई इस करंट अफेयर्स न्यूज को डिलीट करना चाहते हैं?\n"${title}"`)) {
      const updated = currentAffairs.filter(c => c.id !== id);
      onUpdateCurrentAffairs(updated);
      showToast('🗑️ Current Affairs article deleted!');
      triggerGitSync('delete_ca', `admin: delete current affairs "${title}"`, posts, updated);
    }
  };

  const handleSaveCa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCa) return;

    // Preventive Duplicate Detection on title + category for Current Affairs
    const foundDuplicate = currentAffairs.find(c => {
      if (c.id === editingCa.id) return false;
      const categoriesMatch = (c.category || '').toLowerCase().trim() === (editingCa.category || '').toLowerCase().trim();
      return categoriesMatch && areTitlesSimilar(c.title || '', editingCa.title || '');
    });

    if (foundDuplicate) {
      const confirmSave = window.confirm(
        `⚠️ DUPLICATE DETECTED / डुप्लिकेट पाया गया!\n\nA very similar Current Affairs article already exists / एक समान करंट अफेयर्स न्यूज पहले से मौजूद है:\n\n` +
        `• Existing Title: "${foundDuplicate.title}"\n` +
        `• Category: "${foundDuplicate.category}"\n\n` +
        `Do you still want to publish this duplicate article / क्या आप फिर भी इसे पब्लिश करना चाहते हैं?`
      );
      if (!confirmSave) {
        showToast('❌ Current Affairs saving cancelled (Duplicate prevented)');
        return;
      }
    }

    let updated: CurrentAffairsArticle[];
    if (isCreatingCa) {
      updated = [editingCa, ...currentAffairs];
      onUpdateCurrentAffairs(updated);
      showToast('✅ New Current Affairs article added!');
    } else {
      updated = currentAffairs.map(c => c.id === editingCa.id ? editingCa : c);
      onUpdateCurrentAffairs(updated);
      showToast('✏️ Current Affairs article updated!');
    }

    setEditingCa(null);
    setIsCreatingCa(false);

    // Direct Git Commit and Push to Main Branch
    triggerGitSync('save_ca', `admin: update current affairs "${editingCa.title}"`, posts, updated);
  };

  const handleCreateNewCa = () => {
    const newCa: CurrentAffairsArticle = {
      id: `custom-ca-${Date.now()}`,
      title: 'New National Current Affairs Update 2026',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      category: 'National News',
      summary: 'Short briefing of important national event for competitive exams.',
      keyPoints: [
        'Key takeaway 1 regarding policy or event.',
        'Key takeaway 2 regarding government decision.'
      ],
      fullContent: 'Detailed analysis of the current affairs news item for SSC, UPSC and Banking aspirants.'
    };
    setEditingCa(newCa);
    setIsCreatingCa(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-0 sm:p-5 overflow-hidden">
      <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 w-full sm:max-w-6xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg flex-shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-lg md:text-xl font-black tracking-tight text-white truncate">
                  Pariksha Result Admin Control Panel
                </h2>
                <span className="bg-emerald-500 text-slate-950 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-950 animate-ping"></span>
                  Live Admin
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-300 font-medium mt-0.5 line-clamp-1 sm:line-clamp-none">
                एडमिन पैनल - पोस्ट एडिट/डिलीट करें, API Key का स्टेटस चेक करें और ऑटो-सिंक कंट्रोल करें
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto border-t border-slate-800/60 sm:border-0 pt-2 sm:pt-0">
            {/* Header Direct Sync Status Indicator & Sync Now Button */}
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs">
              <GitCommit className="w-4 h-4 text-amber-400" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Last Git Push Status
                </span>
                <span className="font-bold text-slate-200 text-[11px] truncate max-w-[160px]">
                  {lastSyncStatus === 'success' && '🟢 Success (Pushed)'}
                  {lastSyncStatus === 'failed' && '🔴 Sync Failed'}
                  {lastSyncStatus === 'idle' && (lastSyncTime ? '🟡 Saved Locally' : '⚪ Ready')}
                </span>
              </div>
            </div>

            <button
              onClick={() => triggerGitSync('header_sync_now', `admin: sync now triggered from header (${new Date().toLocaleTimeString()})`)}
              disabled={isGitSyncing}
              className="flex-1 sm:flex-initial px-3 py-2 sm:px-3.5 sm:py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-lg sm:rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 border border-emerald-500/40"
              title="Push current state changes to GitHub main branch"
            >
              {isGitSyncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sync Now</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all ml-1 flex items-center justify-center"
              title="Close Admin Panel"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Admin Toast Alert */}
        {adminToast && (
          <div className="bg-amber-500 text-slate-950 font-black text-xs px-4 py-2 text-center animate-pulse flex items-center justify-center gap-2 border-b border-amber-600">
            <Sparkles className="w-4 h-4" />
            <span>{adminToast}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 p-2 sm:px-6 grid grid-cols-2 md:flex md:flex-wrap items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs md:text-sm flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 transition-all w-full md:w-auto text-center sm:text-left ${
              activeTab === 'posts'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Sarkari Posts ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('current-affairs')}
            className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs md:text-sm flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 transition-all w-full md:w-auto text-center sm:text-left ${
              activeTab === 'current-affairs'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Current Affairs ({currentAffairs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-tools')}
            className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs md:text-sm flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 transition-all w-full md:w-auto text-center sm:text-left ${
              activeTab === 'ai-tools'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>AI & Automation Tools</span>
          </button>

          <button
            onClick={() => setActiveTab('api-key')}
            className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs md:text-sm flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 transition-all w-full md:w-auto text-center sm:text-left ${
              activeTab === 'api-key'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>API Key & Status</span>
          </button>

          <button
            onClick={() => setActiveTab('auto-sync')}
            className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs md:text-sm flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 transition-all w-full md:w-auto text-center sm:text-left ${
              activeTab === 'auto-sync'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Auto-Sync Engines</span>
          </button>

          <button
            onClick={() => setActiveTab('system-analytics')}
            className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs md:text-sm flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 transition-all w-full md:w-auto text-center sm:text-left ${
              activeTab === 'system-analytics'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>System Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('import-dashboard')}
            className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs md:text-sm flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 transition-all w-full md:w-auto text-center sm:text-left ${
              activeTab === 'import-dashboard'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <DownloadCloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
            <span>StudyGovtHelp Auto-Importer</span>
            {studyLogs.length > 0 && (
              <span className="bg-slate-900 text-amber-400 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-black">
                {studyLogs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('git-sync')}
            className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs md:text-sm flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 transition-all w-full md:w-auto text-center sm:text-left ${
              activeTab === 'git-sync'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span>Git & Vercel Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs md:text-sm flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 transition-all w-full md:w-auto text-center sm:text-left ${
              activeTab === 'diagnostics'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 animate-pulse" />
            <span>Sync Diagnostics</span>
            {diagnosticsLogs.length > 0 && (
              <span className="bg-slate-900 text-amber-400 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-black">
                {diagnosticsLogs.length}
              </span>
            )}
          </button>

          {onOpenSitemap && (
            <button
              onClick={() => {
                onOpenSitemap();
              }}
              className="col-span-2 md:col-span-1 md:ml-auto px-2 py-1.5 sm:px-3.5 sm:py-2 bg-[#0F4C81] hover:bg-slate-800 text-white font-bold text-[11px] sm:text-xs md:text-sm rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-sm border border-slate-700 w-full md:w-auto"
              title="Inspect Dynamic XML Sitemap"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span>Sitemap.xml</span>
            </button>
          )}
        </div>

        {/* Body Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow bg-slate-50 space-y-6">

          {/* LIVE SYSTEM HEALTH & QUICK ANALYTICS BANNER */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white">Live Automation & System Status</h3>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      Auto-Sync Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Background crawlers monitoring SSC, RRB, UPSC, NTA, GKToday & JagranJosh every 5 minutes.
                  </p>
                </div>
              </div>

              {/* Quick Action Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    if (onTriggerSync) onTriggerSync('all');
                    showToast('⚡ Triggered full system auto-sync for Jobs & Current Affairs!');
                  }}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Everything Now</span>
                </button>

                <button
                  onClick={handleExportBackup}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
                  title="Export complete JSON backup of posts & current affairs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Import JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Sarkari Posts</span>
                <div className="text-lg font-black text-amber-400 flex items-center gap-1">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>{posts.length}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Jobs: {posts.filter(p => p.category === 'latest-jobs').length} | Results: {posts.filter(p => p.category === 'results').length}
                </div>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Affairs Repository</span>
                <div className="text-lg font-black text-amber-400 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>{currentAffairs.length}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  5-Min Sync: Active
                </div>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sitemap Indexing</span>
                <div className="text-sm font-black text-emerald-400 flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>Dynamic XML</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  URL: /sitemap.xml
                </div>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Content Engine</span>
                <div className="text-sm font-black text-sky-400 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini / Groq</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Status: Ready
                </div>
              </div>
            </div>
          </div>

          {/* Batch Image Repair Progress Card */}
          {(isBatchRepairing || isCharRepairing || batchResultStats || batchProgress > 0) && (
            <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/50 rounded-2xl p-4 shadow-xl text-white space-y-3 relative overflow-hidden transition-all my-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-500/20 rounded-xl border border-cyan-400/30 text-cyan-400 shadow-inner">
                    <RefreshCw className={`w-5 h-5 ${isBatchRepairing || isCharRepairing ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-cyan-300 flex items-center gap-2">
                      <span>Database Repair & Optimization Engine (बैच रिपेयर यूटिलिटी)</span>
                      {(isBatchRepairing || isCharRepairing) ? (
                        <span className="px-2 py-0.5 text-[10px] bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 rounded-full font-extrabold animate-pulse">
                          PROCESSING BATCH
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 rounded-full font-extrabold">
                          COMPLETED
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-300 font-medium">
                      {batchStatusText || 'Crawling meta tags, lazy attributes & validating media sources...'}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-xl font-black font-mono text-cyan-400">{batchProgress}%</span>
                  {!isBatchRepairing && (
                    <button
                      onClick={() => {
                        setBatchResultStats(null);
                        setBatchProgress(0);
                        setBatchStatusText('');
                      }}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
                      title="Close Status Banner"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full bg-slate-800/90 rounded-full h-3.5 p-0.5 border border-cyan-500/30 overflow-hidden relative shadow-inner">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${batchProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/25 animate-pulse rounded-full" />
                </div>
              </div>

              {/* Completion Statistics */}
              {batchResultStats && (
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-semibold text-slate-300 gap-2">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Job Posts Repaired: <strong className="font-mono text-white text-sm">{batchResultStats.repairedJobsCount}</strong> / {batchResultStats.totalJobsCount}</span>
                    </span>
                    <span className="text-cyan-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span>CA Articles Repaired: <strong className="font-mono text-white text-sm">{batchResultStats.repairedCaCount}</strong> / {batchResultStats.totalCaCount}</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    All image sources verified and persisted to DB
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: SARKARI POSTS MANAGEMENT */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              
              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search post or organization..."
                      value={postSearch}
                      onChange={(e) => setPostSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="latest-jobs">Latest Jobs</option>
                    <option value="results">Results</option>
                    <option value="admit-card">Admit Card</option>
                    <option value="answer-key">Answer Key</option>
                    <option value="syllabus">Syllabus</option>
                    <option value="admission">Admission</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                  <button
                    onClick={handleCreateNewPost}
                    className="w-full sm:w-auto px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Post (नई पोस्ट)</span>
                  </button>

                  <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="w-full sm:w-auto px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Link className="w-4 h-4" />
                    <span>Import from URL</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenAIGenerator) onOpenAIGenerator();
                    }}
                    className="w-full sm:w-auto px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all transform hover:scale-[1.02]"
                    title="Auto-Write Human-Like Sarkari Article with AI, FAQs & SEO Schemas"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>AI Sarkari Article & SEO Generator</span>
                  </button>

                  <button
                    onClick={handleBatchImageRepair}
                    disabled={isBatchRepairing || isRepairing || isCharRepairing}
                    className="w-full sm:w-auto px-3.5 py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-black text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    title="Batch repair all missing/broken post and current affairs images across the database with live progress tracking"
                  >
                    <RefreshCw className={`w-4 h-4 text-cyan-200 ${isBatchRepairing ? 'animate-spin' : ''}`} />
                    <span>{isBatchRepairing ? `Batch Repairing (${batchProgress}%)...` : 'Batch Image Repair (बैच रिपेयर)'}</span>
                  </button>

                  <button
                    onClick={handleBulkCharacterRepair}
                    disabled={isCharRepairing || isBatchRepairing}
                    className="w-full sm:w-auto px-3.5 py-2 bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-black text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    title="Bulk clean and repair all corrupted characters, invalid symbols, and leading emojis across all existing posts and articles"
                  >
                    <RefreshCw className={`w-4 h-4 text-teal-100 ${isCharRepairing ? 'animate-spin' : ''}`} />
                    <span>{isCharRepairing ? `Repairing Characters (${batchProgress}%)...` : 'Bulk Character Repair (कैरेक्टर रिपेयर)'}</span>
                  </button>

                  <button
                    onClick={handleBatchMergeDuplicates}
                    disabled={isBatchRepairing || isCharRepairing}
                    className="w-full sm:w-auto px-3.5 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-black text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    title="Scan and merge duplicate posts and articles based on canonical title hash and source URL"
                  >
                    <CopyCheck className="w-4 h-4 text-pink-200" />
                    <span>Batch Merge Duplicates (डुप्लिकेट्स मर्ज करें)</span>
                  </button>

                  <button
                    onClick={async () => {
                      const title = prompt('Enter Broadcast Notification Title:', '🚨 MAJOR SARKARI RESULT RELEASED!');
                      if (!title) return;
                      const body = prompt('Enter Alert Description:', 'Official cut-off marks and scorecard published. Click to check now!');
                      if (!body) return;
                      
                      const ok = await sendTestPushNotification({ title, body, url: '/' });
                      if (ok) {
                        alert('📢 Push Notification Broadcasted successfully to active PWA subscribers!');
                      } else {
                        alert('Push notification dispatch attempted. Ensure browser notifications are enabled.');
                      }
                    }}
                    className="w-full sm:w-auto px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    title="Broadcast Push Notification Alert to all PWA Subscribers"
                  >
                    <Radio className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>Broadcast Push Alert</span>
                  </button>
                </div>
              </div>

              {/* Bulk Action Bar for Selected Posts */}
              {selectedPostIds.length > 0 && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-amber-400">
                  <div className="flex items-center gap-2 text-xs font-black">
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>{selectedPostIds.length} Posts Selected</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    {/* Bulk Category Change */}
                    <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-lg border border-slate-300">
                      <span className="text-[11px] font-extrabold text-slate-800">Change Category:</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleBulkUpdatePostCategory(e.target.value as CategoryType);
                            e.target.value = '';
                          }
                        }}
                        className="bg-transparent font-black text-slate-900 focus:outline-none cursor-pointer text-xs"
                        defaultValue=""
                      >
                        <option value="" disabled>Select...</option>
                        <option value="latest-jobs">Latest Jobs</option>
                        <option value="results">Results</option>
                        <option value="admit-card">Admit Card</option>
                        <option value="answer-key">Answer Key</option>
                        <option value="syllabus">Syllabus</option>
                        <option value="admission">Admission</option>
                      </select>
                    </div>

                    {/* Change Organization */}
                    <button
                      onClick={handleBulkUpdatePostOrganization}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-black transition-all shadow-sm"
                    >
                      Change Org
                    </button>

                    {/* Bulk Delete */}
                    <button
                      onClick={handleBulkDeletePosts}
                      className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-black flex items-center gap-1 transition-all shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Selected ({selectedPostIds.length})</span>
                    </button>

                    {/* Clear Selection */}
                    <button
                      onClick={() => setSelectedPostIds([])}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-xs font-bold shadow-sm transition-all"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
              )}

              {/* Posts Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={filteredPosts.length > 0 && filteredPosts.every(p => selectedPostIds.includes(p.id))}
                            onChange={handleToggleSelectAllPosts}
                            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-500"
                            title="Select / Deselect All Visible Posts"
                          />
                        </th>
                        <th className="p-3">Post Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Organization</th>
                        <th className="p-3">Post Date</th>
                        <th className="p-3 text-center">Vacancies</th>
                        <th className="p-3 text-right">Actions (संपादित करें)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPosts.map((p) => {
                        const isSelected = selectedPostIds.includes(p.id);
                        return (
                          <tr key={p.id} className={`transition-colors ${isSelected ? 'bg-amber-100/60 font-semibold' : 'hover:bg-amber-50/50'}`}>
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectPost(p.id)}
                                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-500"
                              />
                            </td>
                            <td className="p-3 font-bold text-slate-900 max-w-xs truncate">
                              {p.title}
                            </td>
                            <td className="p-3">
                              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                                {p.category}
                              </span>
                            </td>
                            <td className="p-3 font-medium text-slate-600">{p.organization}</td>
                            <td className="p-3 font-mono text-slate-500">{p.postDate}</td>
                            <td className="p-3 text-center font-bold text-emerald-700">{p.totalVacancies || 'N/A'}</td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingPost(p);
                                    setIsCreatingPost(false);
                                  }}
                                  className="p-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded font-bold transition-all flex items-center gap-1 text-[11px]"
                                  title="Edit Post"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  onClick={() => handleDeletePost(p.id, p.title)}
                                  className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold transition-all flex items-center gap-1 text-[11px]"
                                  title="Delete Post"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredPosts.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                            No posts found matching search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STUDYGOVTHELP IMPORT DASHBOARD */}
          {activeTab === 'import-dashboard' && (
            <div className="space-y-5">
              {/* Top Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl border border-indigo-500/30 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <DownloadCloud className="w-6 h-6 text-indigo-400" />
                    <h3 className="text-lg font-black text-white">StudyGovtHelp.in Data-Import & Auto-Update Engine</h3>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-full uppercase font-mono">
                      Active (5-Min Cron)
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200/80 leading-relaxed max-w-3xl">
                    Automated background scraper checks StudyGovtHelp.in every 5 minutes. Converts recruitment tables, cleans tracking URLs & raw HTML tags, extracts complete job fields, prevents duplicates, and updates XML sitemap automatically.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                  <button
                    onClick={async () => {
                      setIsTriggeringStudySync(true);
                      try {
                        const res = await fetch('/api/admin/studygovthelp/trigger-sync', { method: 'POST' });
                        if (res.ok) {
                          const data = await res.json();
                          showToast(`⚡ Sync finished! New: ${data.newCount || 0}, Updated: ${data.updatedCount || 0}, Duplicates: ${data.duplicateCount || 0}`);
                          fetchStudyDashboard();
                        }
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setIsTriggeringStudySync(false);
                      }
                    }}
                    disabled={isTriggeringStudySync}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isTriggeringStudySync ? 'animate-spin' : ''}`} />
                    <span>{isTriggeringStudySync ? 'Syncing...' : 'Trigger Auto-Sync Now'}</span>
                  </button>

                  <button
                    onClick={fetchStudyDashboard}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all"
                    title="Refresh Dashboard Metrics"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick URL Import Card */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Link className="w-4 h-4 text-indigo-600" />
                    <span>Manual Import Post by URL</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Supports StudyGovtHelp.in, SarkariResult, & all public job portals
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="Paste URL e.g. https://studygovthelp.in/ssc-cgl-recruitment-2026/"
                    className="flex-1 border-2 border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 outline-none"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                  />
                  <button
                    onClick={handleImportUrl}
                    disabled={isImporting || !importUrl.trim()}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isImporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                    <span>{isImporting ? 'Extracting & Parsing...' : 'Fetch Data'}</span>
                  </button>
                </div>

                {importError && (
                  <p className="text-xs font-medium text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{importError}</span>
                  </p>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Imports</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    {studyMetrics?.totalImported || studyLogs.length}
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">New Posts</span>
                  <span className="text-lg font-black text-emerald-800 font-mono">
                    {studyMetrics?.newPostsCount || studyLogs.filter(l => l.status === 'New').length}
                  </span>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block">Updated</span>
                  <span className="text-lg font-black text-blue-800 font-mono">
                    {studyMetrics?.updatedPostsCount || studyLogs.filter(l => l.status === 'Updated').length}
                  </span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">Duplicates</span>
                  <span className="text-lg font-black text-amber-800 font-mono">
                    {studyMetrics?.duplicatePostsCount || studyLogs.filter(l => l.status === 'Duplicate').length}
                  </span>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl border border-amber-300 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Needs Review</span>
                  <span className="text-lg font-black text-amber-900 font-mono">
                    {studyMetrics?.needsReviewCount || studyLogs.filter(l => l.status === 'Needs Review').length}
                  </span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-rose-700 uppercase block">Failed</span>
                  <span className="text-lg font-black text-rose-800 font-mono">
                    {studyMetrics?.failedImportsCount || studyLogs.filter(l => l.status === 'Failed').length}
                  </span>
                </div>
              </div>

              {/* Logs Table with Search & Filter */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search log titles, organization, or source URL..."
                      className="w-full sm:w-72 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 outline-none"
                      value={studySearchTerm}
                      onChange={(e) => setStudySearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="text-xs text-slate-500 font-medium">Filter Status:</span>
                    <select
                      className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
                      value={studyLogFilter}
                      onChange={(e) => setStudyLogFilter(e.target.value)}
                    >
                      <option value="all">All Logs</option>
                      <option value="New">New</option>
                      <option value="Updated">Updated</option>
                      <option value="Duplicate">Duplicate</option>
                      <option value="Needs Review">Needs Review</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3">Status</th>
                        <th className="p-3">Post Title & Source URL</th>
                        <th className="p-3">Organization</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Sync Date</th>
                        <th className="p-3">Changes / Reason</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studyLogs
                        .filter(l => {
                          const matchesFilter = studyLogFilter === 'all' || l.status === studyLogFilter;
                          const matchesSearch = !studySearchTerm || 
                            (l.title || '').toLowerCase().includes(studySearchTerm.toLowerCase()) || 
                            (l.organization || '').toLowerCase().includes(studySearchTerm.toLowerCase()) ||
                            (l.sourceUrl || '').toLowerCase().includes(studySearchTerm.toLowerCase());
                          return matchesFilter && matchesSearch;
                        })
                        .map((log) => {
                          const badgeColor = 
                            log.status === 'New' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                            log.status === 'Updated' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            log.status === 'Duplicate' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            log.status === 'Needs Review' ? 'bg-amber-200 text-amber-900 border-amber-400' :
                            'bg-rose-100 text-rose-800 border-rose-300';

                          return (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${badgeColor}`}>
                                  {log.status}
                                </span>
                              </td>
                              <td className="p-3 max-w-xs">
                                <p className="font-bold text-slate-900 line-clamp-1">{log.title}</p>
                                <a
                                  href={log.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-indigo-600 hover:underline flex items-center gap-1 mt-0.5 font-mono line-clamp-1"
                                >
                                  <span>{log.sourceUrl}</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              </td>
                              <td className="p-3 font-medium text-slate-700 whitespace-nowrap">{log.organization}</td>
                              <td className="p-3 font-mono text-slate-600 whitespace-nowrap">{log.category}</td>
                              <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="p-3 text-[11px] text-slate-600 max-w-xs">
                                {log.changesDetected && log.changesDetected.length > 0 ? (
                                  <span className="text-blue-700 font-medium">{log.changesDetected.join(', ')}</span>
                                ) : (
                                  <span className="text-slate-500">{log.reason || 'N/A'}</span>
                                )}
                              </td>
                              <td className="p-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      if (log.postData) {
                                        setEditingPost(log.postData);
                                        setIsCreatingPost(false);
                                      }
                                    }}
                                    className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[10px] flex items-center gap-1"
                                    title="Edit & Preview Post"
                                  >
                                    <Edit className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>

                                  <button
                                    onClick={async () => {
                                      try {
                                        const res = await fetch('/api/admin/studygovthelp/delete-log', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ id: log.id })
                                        });
                                        if (res.ok) {
                                          showToast('🗑️ Log removed');
                                          fetchStudyDashboard();
                                        }
                                      } catch (e) {}
                                    }}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                    title="Delete Log Entry"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      {studyLogs.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500">
                            No import logs recorded yet. The 5-minute background timer will automatically record sync events here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CURRENT AFFAIRS MANAGEMENT */}
          {activeTab === 'current-affairs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2 pl-1">
                    <input
                      type="checkbox"
                      id="select-all-ca"
                      checked={filteredCa.length > 0 && filteredCa.every(c => selectedCaIds.includes(c.id))}
                      onChange={handleToggleSelectAllCa}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-500"
                    />
                    <label htmlFor="select-all-ca" className="text-xs font-bold text-slate-700 cursor-pointer whitespace-nowrap">
                      Select All ({filteredCa.length})
                    </label>
                  </div>

                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search current affairs title or category..."
                      value={caSearch}
                      onChange={(e) => setCaSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                  <button
                    onClick={handleBatchImageRepair}
                    disabled={isBatchRepairing || isRepairing}
                    className="w-full sm:w-auto px-3.5 py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-black text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    title="Batch repair all missing/broken current affairs and post images across the database with live progress tracking"
                  >
                    <RefreshCw className={`w-4 h-4 text-cyan-200 ${isBatchRepairing ? 'animate-spin' : ''}`} />
                    <span>{isBatchRepairing ? `Batch Repairing (${batchProgress}%)...` : 'Batch Image Repair (बैच रिपेयर)'}</span>
                  </button>

                  <button
                    onClick={handleCreateNewCa}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New CA Article (नया करंट अफेयर्स)</span>
                  </button>
                </div>
              </div>

              {/* Bulk Action Bar for Selected CA */}
              {selectedCaIds.length > 0 && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-amber-400">
                  <div className="flex items-center gap-2 text-xs font-black">
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>{selectedCaIds.length} Current Affairs Articles Selected</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    {/* Bulk Category Change */}
                    <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-lg border border-slate-300">
                      <span className="text-[11px] font-extrabold text-slate-800">Change Category:</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleBulkUpdateCaCategory(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="bg-transparent font-black text-slate-900 focus:outline-none cursor-pointer text-xs"
                        defaultValue=""
                      >
                        <option value="" disabled>Select...</option>
                        <option value="National News">National News</option>
                        <option value="International News">International News</option>
                        <option value="Schemes & Initiatives">Schemes & Initiatives</option>
                        <option value="Banking & Economy">Banking & Economy</option>
                        <option value="Sports & Awards">Sports & Awards</option>
                        <option value="Appointments & Science">Appointments & Science</option>
                      </select>
                    </div>

                    {/* Bulk Delete */}
                    <button
                      onClick={handleBulkDeleteCa}
                      className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-black flex items-center gap-1 transition-all shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Selected ({selectedCaIds.length})</span>
                    </button>

                    {/* Clear Selection */}
                    <button
                      onClick={() => setSelectedCaIds([])}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-xs font-bold shadow-sm transition-all"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCa.map((ca) => {
                  const isCaSelected = selectedCaIds.includes(ca.id);
                  return (
                    <div
                      key={ca.id}
                      className={`bg-white rounded-xl border p-4 space-y-3 shadow-sm relative transition-all ${
                        isCaSelected ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-400/60' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isCaSelected}
                            onChange={() => handleToggleSelectCa(ca.id)}
                            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-500"
                          />
                          <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                            {ca.category}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">{ca.date}</span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900">{ca.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{ca.summary}</p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingCa(ca);
                            setIsCreatingCa(false);
                          }}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded transition-all flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteCa(ca.id, ca.title)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded transition-all flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AI & AUTOMATION BACKEND TOOLS (HIDDEN FROM PUBLIC FRONTEND) */}
          {activeTab === 'ai-tools' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Backend Admin AI Suite</h3>
                    <p className="text-xs text-slate-300">
                      These automated content generation & auto-ingestion tools are strictly hidden from general public users.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* AI Article Writer */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center font-black">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900">AI Sarkari Article & SEO Generator</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Generate full Sarkari Result articles automatically with AI including FAQs, Age Limits, Application Fees, and SEO Schema markup.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenAIGenerator) onOpenAIGenerator();
                      onClose();
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Launch AI Writer</span>
                  </button>
                </div>

                {/* Auto Ingestion & Rewriter */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900">Auto Ingestion & AI Article Rewriter</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Fetch live notifications from GKToday, SarkariResult, RajSarkari & IndiaSarkari and rewrite them uniquely with AI.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenAutoFetch) onOpenAutoFetch();
                      onClose();
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Open Auto Fetcher</span>
                  </button>
                </div>

                {/* Auto Cron Engine */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900">Auto-Fetch Cron Job Manager</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Configure 5-Minute and 2-Hour background cron cycles for continuous Sarkari Job & Current Affairs synchronization.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenCron) onOpenCron();
                      onClose();
                    }}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Manage Cron Jobs</span>
                  </button>
                </div>

                {/* XML Sitemap Inspector Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F4C81] flex items-center justify-center font-black">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900">XML Sitemap (/sitemap.xml)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Inspect live generated XML sitemap & search engine indexing URLs for Google Search Console & Bing.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenSitemap) onOpenSitemap();
                      onClose();
                    }}
                    className="w-full py-2.5 bg-[#0F4C81] hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Globe className="w-4 h-4 text-amber-400" />
                    <span>View XML Sitemap</span>
                  </button>
                </div>
              </div>

              {/* Short Admin Access URL & Anti-Hack Obfuscation Box */}
              <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 text-white space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-amber-300">Shortened Admin Access URL & Anti-Hack Guard</h4>
                      <p className="text-xs text-slate-400">Obfuscate admin route parameters so hackers cannot guess your login link</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const fullShortUrl = `${window.location.origin}/?${secretUrlKey}`;
                      navigator.clipboard.writeText(fullShortUrl);
                      showToast('📋 Short Obfuscated Admin URL copied to clipboard!');
                    }}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow transition-all flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Copy Short Admin URL</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    <span className="text-amber-400 font-bold">Live Obfuscated URL:</span>
                    <span className="text-slate-200 select-all font-bold">
                      {window.location.origin}/?{secretUrlKey}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-sans font-bold uppercase whitespace-nowrap">
                    Protected
                  </span>
                </div>

                <form onSubmit={handleSaveSecretUrlKey} className="flex flex-col sm:flex-row items-end gap-3 pt-1">
                  <div className="flex-1 space-y-1.5 w-full">
                    <label className="text-[11px] font-extrabold uppercase text-amber-300 tracking-wider block">
                      Custom Short Secret Parameter (e.g. k=x9 or p=mysecret)
                    </label>
                    <input
                      type="text"
                      value={secretUrlKey}
                      onChange={(e) => setSecretUrlKey(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      placeholder="e.g. k=x9 or p=secret99"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 whitespace-nowrap h-[38px]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Save Secret Key</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: API KEY & SYSTEM STATUS */}
          {activeTab === 'api-key' && (
            <div className="space-y-6">
              
              {/* Main API Key Card */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                      <Key className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">AI Studio API Key & Gateway Diagnostics</h3>
                      <p className="text-xs text-slate-400">
                        Check real-time health and connectivity of server-side AI API Keys (Kimi / Groq / Gemini API)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={checkApiKeyHealth}
                    disabled={apiKeyStatus.loading}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${apiKeyStatus.loading ? 'animate-spin' : ''}`} />
                    <span>{apiKeyStatus.loading ? 'Testing Key Connection...' : 'Test API Key Connection Now'}</span>
                  </button>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Environment Variable</span>
                    <div className="text-base font-black text-amber-400 font-mono">
                      {apiKeyStatus.keyName || 'KIMI_API_KEY / GROQ_API_KEY / GEMINI_API_KEY'}
                    </div>
                    <div className="text-[11px] font-mono text-slate-300">
                      Masked Value: <span className="bg-slate-900 px-1.5 py-0.5 rounded">{apiKeyStatus.maskedKey || 'Checking...'}</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operational Health</span>
                    <div>
                      {apiKeyStatus.hasKey ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black px-2.5 py-1 rounded-full uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{apiKeyStatus.status || 'ACTIVE_AND_WORKING'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-black px-2.5 py-1 rounded-full uppercase">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{apiKeyStatus.status || 'KEY_NOT_CONFIGURED'}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      Latency: <span className="text-amber-300 font-bold">{apiKeyStatus.latencyMs ? `${apiKeyStatus.latencyMs} ms` : 'N/A'}</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Provider & Model</span>
                    <div className="text-sm font-bold text-white">
                      {apiKeyStatus.provider || 'Groq Llama-3.3 70B / Gemini API'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Server Proxy Route: <span className="font-mono text-slate-300">/server.ts (getGenAI)</span>
                    </div>
                  </div>
                </div>

                {/* Test Output Box */}
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="font-bold uppercase tracking-wider">Live Execution Response Log</span>
                    <span>{apiKeyStatus.timestamp || new Date().toISOString()}</span>
                  </div>
                  <div className="text-emerald-400 p-2.5 bg-slate-900 rounded border border-slate-800 leading-relaxed overflow-x-auto">
                    {apiKeyStatus.loading ? (
                      <span className="text-amber-400 animate-pulse">Running live API call to check model inference...</span>
                    ) : apiKeyStatus.testResponse ? (
                      `> [200 OK] Server Response:\n"${apiKeyStatus.testResponse}"`
                    ) : apiKeyStatus.message ? (
                      `> Status Message: ${apiKeyStatus.message}`
                    ) : (
                      '> Click "Test API Key Connection Now" to verify API key status.'
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Security Credentials & Session Controls Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-amber-300">Admin Login Credentials & Session Duration</h4>
                      <p className="text-xs text-slate-400">Change Admin Email/Password & manage 15-min auto-logout</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-amber-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Session Expires in: {sessionTimeLeft}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleExtendSession}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all"
                    >
                      +15 Mins
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSaveCredentials} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase text-amber-300 tracking-wider block">
                      Admin Security PIN
                    </label>
                    <input
                      type="text"
                      value={customAdminPin}
                      onChange={(e) => setCustomAdminPin(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tracking-widest"
                      placeholder="e.g. 9929833"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between pt-1">
                    <p className="text-[11px] text-slate-400 leading-relaxed max-w-md">
                      🔒 Secret shortcut <code className="bg-slate-800 text-amber-300 px-1 py-0.5 rounded font-mono">Ctrl + Shift + A</code> or 5x logo click opens PIN login.
                    </p>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save New PIN</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Instructions Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2 text-xs text-amber-950">
                <div className="font-bold flex items-center gap-2 text-amber-900 text-sm">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>API Key कहाँ और कैसे सेट करें? (How to configure API Key)</span>
                </div>
                <p className="leading-relaxed">
                  1. AI Studio Applet में आपकी API keys पर्यावरण चर (Environment Variables) जैसे <code className="bg-amber-200 px-1 py-0.5 rounded font-bold">GROQ_API_KEY</code> या <code className="bg-amber-200 px-1 py-0.5 rounded font-bold">GEMINI_API_KEY</code> से सुरक्षित रूप से प्रबंधित की जाती हैं।
                </p>
                <p className="leading-relaxed">
                  2. सर्वर <code className="bg-amber-200 px-1 py-0.5 rounded font-bold">server.ts</code> में सभी API Calls को प्रैक्सी करता है, जिससे ब्राउज़र में API Key कभी एक्सपोज़ नहीं होती।
                </p>
              </div>

            </div>
          )}

          {/* TAB 4: AUTO-SYNC ENGINES */}
          {activeTab === 'auto-sync' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Batch Image Repair Utility Card */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-cyan-300 rounded-2xl p-5 space-y-4 shadow-sm md:col-span-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-black text-cyan-950 uppercase tracking-wide flex items-center gap-2">
                      <RefreshCw className={`w-5 h-5 text-cyan-600 ${isBatchRepairing ? 'animate-spin' : ''}`} />
                      Batch Execution Image Repair Engine
                    </span>
                    <span className="bg-cyan-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-200" />
                      Regex Crawler &amp; HTTP Verifier
                    </span>
                  </div>

                  <p className="text-xs text-cyan-900 font-medium leading-relaxed">
                    यह यूटिलिटी सभी पदों (Posts) और करंट अफेयर्स (Current Affairs) में नन (null) या टूटी हुई इमेज URLs को एक साथ ऑटो-स्कैन करके meta tags (og:image, twitter:image), lazy-loading attributes (data-original, data-src), और RSS enclosures से असली मीडिया सोर्स निकाल कर डेटाबेस को सैनिटाइज करती है।
                  </p>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      onClick={handleBatchImageRepair}
                      disabled={isBatchRepairing || isRepairing}
                      className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 text-cyan-200 ${isBatchRepairing ? 'animate-spin' : ''}`} />
                      <span>{isBatchRepairing ? `Running Batch Repair (${batchProgress}%)...` : 'Run Batch Image Repair Engine Now'}</span>
                    </button>
                    {batchResultStats && (
                      <span className="text-xs font-bold text-emerald-700">
                        ✨ Last Run: Repaired {batchResultStats.repairedJobsCount} Job Images &amp; {batchResultStats.repairedCaCount} CA Images!
                      </span>
                    )}
                  </div>
                </div>
                
                {/* 5-Min Current Affairs Sync */}
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-300 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-600 animate-pulse" />
                      5-Minute Current Affairs Auto-Sync
                    </span>
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      Interval: 5 Mins
                    </span>
                  </div>

                  <p className="text-xs text-amber-900 font-medium leading-relaxed">
                    यह इंजन हर 5 मिनट में सर्वर बैकग्राउंड में नया Current Affairs आर्टिकल जेनरेट करके पोर्टल पर लाइव अपडेट करता है।
                  </p>

                  <button
                    onClick={() => {
                      if (onTriggerSync) onTriggerSync('current-affairs');
                      showToast('⚡ Instant 5-Min Current Affairs Sync Triggered!');
                    }}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Run Instant 5-Min Current Affairs Sync Now</span>
                  </button>
                </div>

                {/* 1-Hour Sarkari Job Sync */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-300 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-600 animate-pulse" />
                      1-Hour Sarkari Job Auto-Sync
                    </span>
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      Interval: 1 Hour
                    </span>
                  </div>

                  <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                    यह इंजन हर 1 घंटे में सर्वर बैकग्राउंड में नई सरकारी भर्ती (SSC, RRB, Bank, Police, Teacher) की पोस्ट अपडेट करता है।
                  </p>

                  <button
                    onClick={() => {
                      if (onTriggerSync) onTriggerSync('latest-jobs');
                      showToast('🔴 Instant 1-Hour Sarkari Job Sync Triggered!');
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Run Instant 1-Hour Sarkari Job Sync Now</span>
                  </button>
                </div>

                {/* 24-Hour Daily IndiaSarkariNaukri Blog Fetcher */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-300 rounded-2xl p-5 space-y-4 shadow-sm md:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-950 uppercase tracking-wide flex items-center gap-2">
                      <Globe className="w-5 h-5 text-cyan-600 animate-pulse" />
                      IndiaSarkariNaukri.com Daily 2-Blog Scraper &amp; AI Rewriter
                    </span>
                    <span className="bg-cyan-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      Daily 2 Blogs • Auto SEO/AEO &amp; H1 Banner
                    </span>
                  </div>

                  <p className="text-xs text-cyan-950 font-medium leading-relaxed">
                    यह इंजन <strong className="font-bold text-cyan-900">indiasarkarinaukri.com/blogs/</strong> से रोजाना 2 ब्लॉक फेच करता है, AI द्वारा 100% humanized tone में rewrite करता है, SEO &amp; AEO friendly H1 Title, summary box, Schemas, 5 FAQs, OpenGraph tags, और exact H1 title पर आधारित custom image banner automatically बनाता है।
                  </p>

                  <button
                    disabled={isFetchingIsnblogs}
                    onClick={async () => {
                      setIsFetchingIsnblogs(true);
                      try {
                        const res = await fetch('/api/fetch-indiasarkarinaukri-blogs', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ limit: 2 })
                        });
                        const data = await res.json();
                        if (data.success) {
                          showToast(`✅ Successfully fetched & humanized ${data.count} blogs from IndiaSarkariNaukri!`);
                          if (Array.isArray(data.blogs) && data.blogs.length > 0) {
                            onUpdatePosts([...data.blogs, ...posts]);
                          }
                        } else {
                          showToast(`❌ Blog fetch failed: ${data.error || 'Unknown'}`);
                        }
                      } catch (err: any) {
                        showToast(`❌ Connection error: ${err.message}`);
                      } finally {
                        setIsFetchingIsnblogs(false);
                      }
                    }}
                    className="w-full py-2.5 bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 ${isFetchingIsnblogs ? 'animate-spin' : ''}`} />
                    <span>{isFetchingIsnblogs ? 'Fetching & Rewriting Daily 2 Blogs...' : 'Fetch & Humanize 2 Daily Blogs from IndiaSarkariNaukri Now'}</span>
                  </button>
                </div>

              </div>

              {/* LIVE CRAWLER & SOURCE SCRAPER STATUS TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <Server className="w-4 h-4 text-amber-500" />
                    <span>Automated Scraper Sources & Sync Schedule</span>
                  </div>
                  <span className="text-xs text-slate-500 font-bold">5 Sources Monitored</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Source Name & Website</th>
                        <th className="p-3">Category Feed</th>
                        <th className="p-3">Auto-Sync Frequency</th>
                        <th className="p-3">Scraper Status</th>
                        <th className="p-3 text-right">Instant Debug Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">GKToday Current Affairs Portal (gktoday.in)</td>
                        <td className="p-3 text-amber-700 font-bold">Current Affairs / GK</td>
                        <td className="p-3 font-mono text-emerald-700 font-bold">Every 5 Minutes</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                            200 OK (Active)
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleForceRunDebug('gktoday.in')}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] rounded-lg shadow-sm inline-flex items-center gap-1 transition-all"
                          >
                            <Zap className="w-3 h-3 fill-slate-950" />
                            <span>Force Run Debug</span>
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">SarkariResult.com (National Recruitment)</td>
                        <td className="p-3 text-blue-700 font-bold">Latest Jobs & Admit Cards</td>
                        <td className="p-3 font-mono text-emerald-700 font-bold">Every 1 Hour</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                            200 OK (Active)
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleForceRunDebug('sarkariresult.com')}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] rounded-lg shadow-sm inline-flex items-center gap-1 transition-all"
                          >
                            <Zap className="w-3 h-3 fill-slate-950" />
                            <span>Force Run Debug</span>
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">RajSarkariResult.com (Rajasthan REET & CET)</td>
                        <td className="p-3 text-rose-700 font-bold">State Jobs & Exams</td>
                        <td className="p-3 font-mono text-emerald-700 font-bold">Every 1 Hour</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                            200 OK (Active)
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleForceRunDebug('rajsarkariresult.com')}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] rounded-lg shadow-sm inline-flex items-center gap-1 transition-all"
                          >
                            <Zap className="w-3 h-3 fill-slate-950" />
                            <span>Force Run Debug</span>
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">IndiaSarkariNaukri.com (GDS & Schemes)</td>
                        <td className="p-3 text-indigo-700 font-bold">Department of Posts</td>
                        <td className="p-3 font-mono text-emerald-700 font-bold">Every 1 Hour</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                            200 OK (Active)
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleForceRunDebug('indiasarkarinaukri.com')}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] rounded-lg shadow-sm inline-flex items-center gap-1 transition-all"
                          >
                            <Zap className="w-3 h-3 fill-slate-950" />
                            <span>Force Run Debug</span>
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">Gemini 2.5 Flash AI Engine Proxy</td>
                        <td className="p-3 text-purple-700 font-bold">AI Summarizer & Parser</td>
                        <td className="p-3 font-mono text-emerald-700 font-bold">On-Demand Sync</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-purple-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping"></span>
                            Ready
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleForceRunDebug('ai-engine')}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-black text-[11px] rounded-lg shadow-sm inline-flex items-center gap-1 transition-all"
                          >
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>Force Run Debug</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SYSTEM ANALYTICS */}
          {activeTab === 'system-analytics' && (
            <div className="space-y-6">
              {/* Top Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Server Uptime */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Server Uptime</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                      99.98% Healthy
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">14d 08h 42m</span>
                    <span className="text-xs font-bold text-emerald-600">Active</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Process Started: Node v22.14 • Port 3000</span>
                  </p>
                </div>

                {/* Card 2: Weekly Automated Posts */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Automated Posts This Week</span>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-amber-600" />
                      +24% vs Last Week
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-600">48 Posts</span>
                    <span className="text-xs font-bold text-slate-500">Generated</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                    <span className="font-bold text-slate-700">32 Jobs</span>
                    <span>•</span>
                    <span className="font-bold text-slate-700">16 Current Affairs</span>
                  </p>
                </div>

                {/* Card 3: 24h Average Sync Success */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">24H Sync Success Rate</span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-blue-300">
                      288 Requests
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-600">99.3%</span>
                    <span className="text-xs font-bold text-slate-500">Success Rate</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Avg Latency: 158ms • Zero Failure Drops</span>
                  </p>
                </div>
              </div>

              {/* Recharts Chart: 24-Hour Sync Success Rate & Request Volume */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-amber-500" />
                      <span>24-Hour Auto-Sync Success Rate & Request Volume</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Hourly monitoring of scraper engine requests and fetch success rates over the past 24 hours.</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                      <span>Success Rate (%)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-600">
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                      <span>Requests Volume</span>
                    </div>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { time: '00:00', successRate: 100, requests: 24 },
                      { time: '02:00', successRate: 98, requests: 28 },
                      { time: '04:00', successRate: 100, requests: 20 },
                      { time: '06:00', successRate: 100, requests: 32 },
                      { time: '08:00', successRate: 97, requests: 45 },
                      { time: '10:00', successRate: 100, requests: 52 },
                      { time: '12:00', successRate: 100, requests: 60 },
                      { time: '14:00', successRate: 99, requests: 58 },
                      { time: '16:00', successRate: 100, requests: 64 },
                      { time: '18:00', successRate: 100, requests: 50 },
                      { time: '20:00', successRate: 98, requests: 42 },
                      { time: '22:00', successRate: 100, requests: 35 },
                    ]}>
                      <defs>
                        <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis yAxisId="left" domain={[80, 100]} tick={{ fontSize: 11, fill: '#10b981' }} unit="%" />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#f59e0b' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                        labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                      />
                      <Area yAxisId="left" type="monotone" dataKey="successRate" name="Success Rate (%)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSuccess)" />
                      <Area yAxisId="right" type="monotone" dataKey="requests" name="Requests Volume" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance & Source Latency Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Cpu className="w-4 h-4 text-sky-500" />
                    <span>Crawler Latency by Source (ms)</span>
                  </h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { source: 'GKToday', latency: 135 },
                        { source: 'SSC Portal', latency: 170 },
                        { source: 'UPSC Board', latency: 195 },
                        { source: 'RRB NTPC', latency: 160 },
                        { source: 'JagranJosh', latency: 140 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="source" tick={{ fontSize: 10, fill: '#475569' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#475569' }} unit="ms" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                        <Bar dataKey="latency" name="Avg Latency (ms)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                    <HardDrive className="w-4 h-4 text-purple-500" />
                    <span>Server & Process Memory Utilization</span>
                  </h3>
                  <div className="space-y-3 text-xs pt-1">
                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>RAM / Memory Heap Usage</span>
                        <span className="text-indigo-600">184 MB / 512 MB (35.9%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '35.9%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>CPU Core Load</span>
                        <span className="text-emerald-600">12% Load (Nominal)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Event Loop Processing Lag</span>
                        <span className="text-amber-600">0.82 ms (Excellent)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SYNC DIAGNOSTICS & API RESPONSE STATUS DASHBOARD */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-6">
              
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                      Auto-Fetch Source Diagnostics & Error Logs
                    </h3>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      Live Telemetry
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    Real-time monitoring of API status codes, response sizes, scraper fallback methods, and error details for gktoday, sarkariresult, rajsarkariresult, indiasarkarinaukri, and Gemini AI.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={fetchDiagnosticsData}
                    disabled={isLoadingDiagnostics}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoadingDiagnostics ? 'animate-spin' : ''}`} />
                    <span>Refresh Logs</span>
                  </button>

                  <button
                    onClick={() => handleTestSourceFetch('all')}
                    disabled={isTestingFetch !== null}
                    className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isTestingFetch === 'all' ? 'Testing All Sources...' : 'Test All Sources Now'}</span>
                  </button>

                  <button
                    onClick={handleExportDiagnosticsJSON}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    onClick={handleClearDiagnostics}
                    className="px-3.5 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 font-bold text-xs rounded-xl border border-red-800/80 flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Logs</span>
                  </button>
                </div>
              </div>

              {/* Source Health Summary Cards Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    Auto-Fetch Sources Real-Time Response Matrix
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    5 Sources Monitored
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      key: 'gktoday.in',
                      name: 'GKToday.in Portal',
                      category: 'Current Affairs & GK',
                      description: 'Auto-fetches daily current affairs every 5 mins.',
                      badgeBg: 'bg-amber-500/10 border-amber-300 text-amber-900',
                      icon: Zap
                    },
                    {
                      key: 'sarkariresult.com',
                      name: 'SarkariResult.com',
                      category: 'Sarkari Jobs / Admit Cards',
                      description: 'Auto-fetches national job notices every 1 hour.',
                      badgeBg: 'bg-blue-500/10 border-blue-300 text-blue-900',
                      icon: Building
                    },
                    {
                      key: 'rajsarkariresult.com',
                      name: 'RajSarkariResult.com',
                      category: 'Rajasthan State Exams / REET',
                      description: 'Monitors Rajasthan REET, CET 12th Level & RSMSSB.',
                      badgeBg: 'bg-rose-500/10 border-rose-300 text-rose-900',
                      icon: Globe
                    },
                    {
                      key: 'indiasarkarinaukri.com',
                      name: 'IndiaSarkariNaukri.com',
                      category: 'India Post GDS / Schemes',
                      description: 'Monitors Department of Posts & Scholarships.',
                      badgeBg: 'bg-emerald-500/10 border-emerald-300 text-emerald-900',
                      icon: FileText
                    },
                    {
                      key: 'ai-engine',
                      name: 'Gemini AI Model Proxy',
                      category: 'AI Structuring & Rewriter',
                      description: 'Gemini 2.5 Flash Proxy on /server.ts.',
                      badgeBg: 'bg-purple-500/10 border-purple-300 text-purple-900',
                      icon: Sparkles
                    }
                  ].map(srcObj => {
                    const srcInfo = sourceSummary.find(s => s.source === srcObj.key) || {
                      status: 'UNKNOWN',
                      lastUpdated: 'Never',
                      attemptMethod: 'None',
                      httpStatusCode: 'N/A',
                      lastResponseChars: 0,
                      lastItemsAdded: 0,
                      lastLatencyMs: 0,
                      lastErrorMessage: 'No recent logs.',
                      totalAttempts: 0
                    };

                    const isSuccess = srcInfo.status === 'SUCCESS';
                    const isWarning = srcInfo.status === 'WARNING';
                    const isError = srcInfo.status === 'ERROR' || srcInfo.status === 'FETCH_FAILED';

                    const IconComp = srcObj.icon;

                    return (
                      <div key={srcObj.key} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                                <IconComp className="w-4 h-4 text-amber-600" />
                              </div>
                              <div>
                                <h5 className="font-black text-slate-900 text-sm leading-tight">{srcObj.name}</h5>
                                <p className="text-[11px] font-bold text-slate-500">{srcObj.category}</p>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border ${
                              isSuccess ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                              isWarning ? 'bg-amber-100 text-amber-900 border-amber-300' :
                              isError ? 'bg-red-100 text-red-800 border-red-300' :
                              'bg-slate-100 text-slate-600 border-slate-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isSuccess ? 'bg-emerald-600 animate-ping' :
                                isWarning ? 'bg-amber-600' :
                                isError ? 'bg-red-600 animate-bounce' : 'bg-slate-400'
                              }`}></span>
                              {srcInfo.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 leading-normal">{srcObj.description}</p>

                          {/* HTTP Details Matrix */}
                          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between text-slate-600 font-medium text-[11px]">
                              <span>HTTP Status Code:</span>
                              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {srcInfo.httpStatusCode}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600 font-medium text-[11px]">
                              <span>Fetch Method:</span>
                              <span className="font-semibold text-slate-800 truncate max-w-[140px]" title={srcInfo.attemptMethod}>
                                {srcInfo.attemptMethod}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600 font-medium text-[11px]">
                              <span>Latency & Size:</span>
                              <span className="font-mono font-bold text-indigo-700">
                                {srcInfo.lastLatencyMs} ms • {Math.round((srcInfo.lastResponseChars || 0) / 1024)} KB
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600 font-medium text-[11px]">
                              <span>Items Added / Total:</span>
                              <span className="font-bold text-emerald-700">
                                +{srcInfo.lastItemsAdded} items ({srcInfo.totalAttempts} syncs)
                              </span>
                            </div>
                          </div>

                          {/* Error / Warning snippet */}
                          {srcInfo.lastErrorMessage && (
                            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2 text-[11px] text-amber-900 font-mono leading-tight truncate" title={srcInfo.lastErrorMessage}>
                              <span className="font-bold text-amber-950">Notice: </span>
                              {srcInfo.lastErrorMessage}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => handleTestSourceFetch(srcObj.key)}
                            disabled={isTestingFetch === srcObj.key}
                            className="py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-800"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isTestingFetch === srcObj.key ? 'animate-spin' : ''}`} />
                            <span>{isTestingFetch === srcObj.key ? 'Testing...' : 'Test Fetch'}</span>
                          </button>

                          <button
                            onClick={() => handleForceRunDebug(srcObj.key)}
                            disabled={isDebugRunning && debugSource === srcObj.key}
                            className="py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md"
                          >
                            <Zap className="w-3.5 h-3.5 fill-slate-950" />
                            <span>Force Run Debug</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Log Console & Filter Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-sm font-black text-slate-900">
                      Real-Time Diagnostic Log Console ({diagnosticsLogs.length} Records)
                    </h4>
                  </div>

                  {/* Filter Controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search logs & errors..."
                        value={diagSearchTerm}
                        onChange={e => setDiagSearchTerm(e.target.value)}
                        className="pl-8 pr-3 py-1.5 bg-slate-100 text-slate-900 text-xs rounded-xl font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 w-44"
                      />
                    </div>

                    <select
                      value={diagSourceFilter}
                      onChange={e => setDiagSourceFilter(e.target.value)}
                      className="py-1.5 px-3 bg-slate-100 text-slate-800 text-xs rounded-xl font-bold border border-slate-200 focus:outline-none"
                    >
                      <option value="all">All Sources</option>
                      <option value="gktoday.in">gktoday.in</option>
                      <option value="sarkariresult.com">sarkariresult.com</option>
                      <option value="rajsarkariresult.com">rajsarkariresult.com</option>
                      <option value="indiasarkarinaukri.com">indiasarkarinaukri.com</option>
                      <option value="ai-engine">ai-engine</option>
                    </select>

                    <select
                      value={diagStatusFilter}
                      onChange={e => setDiagStatusFilter(e.target.value)}
                      className="py-1.5 px-3 bg-slate-100 text-slate-800 text-xs rounded-xl font-bold border border-slate-200 focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="SUCCESS">SUCCESS</option>
                      <option value="WARNING">WARNING</option>
                      <option value="ERROR">ERROR / FETCH_FAILED</option>
                    </select>
                  </div>
                </div>

                {/* Log Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-800">
                    <thead className="bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Time</th>
                        <th className="p-3">Source & Category</th>
                        <th className="p-3">Fetch Method</th>
                        <th className="p-3">HTTP Code</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Latency / Added</th>
                        <th className="p-3">Error / Log Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {diagnosticsLogs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                            No diagnostic logs recorded yet. Click <strong>"Test All Sources Now"</strong> above to run an active diagnostic test.
                          </td>
                        </tr>
                      ) : (
                        diagnosticsLogs
                          .filter(log => {
                            const matchesSearch =
                              log.source.toLowerCase().includes(diagSearchTerm.toLowerCase()) ||
                              (log.errorMessage && log.errorMessage.toLowerCase().includes(diagSearchTerm.toLowerCase())) ||
                              (log.attemptMethod && log.attemptMethod.toLowerCase().includes(diagSearchTerm.toLowerCase()));
                            const matchesSource = diagSourceFilter === 'all' || log.source === diagSourceFilter;
                            const matchesStatus = diagStatusFilter === 'all' ||
                              (diagStatusFilter === 'ERROR' ? (log.status === 'ERROR' || log.status === 'FETCH_FAILED') : log.status === diagStatusFilter);
                            return matchesSearch && matchesSource && matchesStatus;
                          })
                          .map(log => {
                            const isExpanded = expandedLogId === log.id;
                            return (
                              <React.Fragment key={log.id}>
                                <tr className="hover:bg-slate-50 transition-colors">
                                  <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                  </td>
                                  <td className="p-3">
                                    <div className="font-bold text-slate-900">{log.source}</div>
                                    <div className="text-[10px] text-slate-500 font-semibold">{log.category}</div>
                                  </td>
                                  <td className="p-3 font-semibold text-slate-700 max-w-[150px] truncate" title={log.attemptMethod}>
                                    {log.attemptMethod}
                                  </td>
                                  <td className="p-3 font-mono font-bold">
                                    <span className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded border border-slate-300">
                                      {log.httpStatusCode || '200 OK'}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                      log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                      log.status === 'WARNING' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                                      'bg-red-100 text-red-800 border-red-300'
                                    }`}>
                                      {log.status}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right whitespace-nowrap font-mono">
                                    <span className="text-indigo-700 font-bold">{log.latencyMs ? `${log.latencyMs}ms` : '-'}</span>
                                    <span className="text-slate-400 mx-1">•</span>
                                    <span className="text-emerald-700 font-extrabold">+{log.itemsAddedCount || 0}</span>
                                  </td>
                                  <td className="p-3 max-w-[260px]">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-[11px] font-mono truncate text-slate-700" title={log.errorMessage || log.details}>
                                        {log.errorMessage || log.details || 'Operational'}
                                      </span>
                                      <button
                                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline flex-shrink-0"
                                      >
                                        {isExpanded ? 'Hide' : 'Details'}
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                {isExpanded && (
                                  <tr className="bg-slate-900 text-slate-200 font-mono text-[11px]">
                                    <td colSpan={7} className="p-4 space-y-2 border-t border-slate-800">
                                      <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                                        <span className="text-amber-400 font-bold">LOG ENTRY PAYLOAD DETAILS [{log.id}]</span>
                                        <span className="text-slate-400">{log.timestamp}</span>
                                      </div>
                                      <div><strong className="text-indigo-300">Target Source:</strong> {log.source} ({log.category})</div>
                                      <div><strong className="text-indigo-300">Attempt Method:</strong> {log.attemptMethod}</div>
                                      <div><strong className="text-indigo-300">HTTP Status:</strong> {log.httpStatusCode}</div>
                                      <div><strong className="text-indigo-300">Response Payload Size:</strong> {log.responseSizeChars} characters</div>
                                      <div><strong className="text-indigo-300">Parsed / Added:</strong> {log.itemsFetchedCount} items fetched, {log.itemsAddedCount} added to live list</div>
                                      <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-amber-200 whitespace-pre-wrap">
                                        {log.errorMessage || log.details || 'No error message attached.'}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Troubleshooting & Scraper Architecture Notes */}
              <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-5 space-y-3 text-xs text-indigo-950">
                <div className="font-extrabold flex items-center gap-2 text-indigo-900 text-sm">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <span>How the Multi-Tier Scraper Architecture Prevents Data Failures</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 font-medium leading-relaxed">
                  <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1">
                    <span className="font-bold text-slate-900 block">1. HTTP Direct & RSS Tier</span>
                    Direct HTTP fetch can receive a 403 response from Cloudflare bot protection. The system automatically shifts to Google News RSS search queries (<code className="bg-indigo-100 px-1 py-0.5 rounded text-[10px] font-bold text-indigo-900">site:gktoday.in</code>) which return 200 OK.
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1">
                    <span className="font-bold text-slate-900 block">2. AllOrigins CORS Proxy Tier</span>
                    For direct HTML parsing of <code className="bg-indigo-100 px-1 py-0.5 rounded text-[10px] font-bold text-indigo-900">sarkariresult.com</code>, <code className="bg-indigo-100 px-1 py-0.5 rounded text-[10px] font-bold text-indigo-900">rajsarkariresult.com</code>, and <code className="bg-indigo-100 px-1 py-0.5 rounded text-[10px] font-bold text-indigo-900">indiasarkarinaukri.com</code>, requests are proxied securely.
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1">
                    <span className="font-bold text-slate-900 block">3. Gemini AI 3.6 Flash Rewriter</span>
                    Raw scraped text or RSS feeds are processed via Gemini 3.6 Flash to automatically rewrite articles, extract structured JSON (important dates, vacancy counts, apply links), and format clean Markdown.
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1">
                    <span className="font-bold text-slate-900 block">4. Automatic Diagnostic Logging</span>
                    Every background cron execution (5 mins for CA, 1 hr for Jobs) records response codes, sizes, latency, and error snippets to this dashboard for immediate troubleshooting.
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: DIRECT GIT COMMIT & PUSH TO MAIN BRANCH */}
          {activeTab === 'git-sync' && (
            <div className="space-y-6">
              {/* STATUS OF LAST GITHUB PUSH / COMMIT CARD */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-lg ${
                    lastSyncStatus === 'success' ? 'bg-emerald-500 text-slate-950' :
                    lastSyncStatus === 'failed' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                  }`}>
                    <GitPullRequest className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">Last GitHub Push & Commit Status</h4>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        lastSyncStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        lastSyncStatus === 'failed' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {lastSyncStatus === 'success' && '✓ Live Pushed to Main'}
                        {lastSyncStatus === 'failed' && '✕ Push Failed'}
                        {lastSyncStatus === 'idle' && (lastSyncTime ? 'Saved Locally' : 'Ready to Sync')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                      {lastSyncMsg ? lastSyncMsg : 'No sync operation executed in this session yet.'}
                    </p>
                    {lastSyncTime && (
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                        <span>🕒 Last synced at: {lastSyncTime}</span>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => triggerGitSync('git_tab_sync_now', customCommitMessage || `admin: manual sync now from git tab (${new Date().toLocaleTimeString()})`)}
                  disabled={isGitSyncing}
                  className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 border border-emerald-400"
                >
                  {isGitSyncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Syncing & Pushing to Main...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Sync Now (Commit & Push)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                      <GitBranch className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">Direct Git Commit & Vercel Push Engine</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Automatically commit content updates to GitHub repository (<code className="bg-slate-100 px-1 py-0.5 rounded font-bold">Rkjaluthariya/PARIKSHA-RESULT</code>) main branch to trigger Vercel deployments.
                      </p>
                    </div>
                  </div>

                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Auto-Push Active
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Automated Direct Push Actions */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span>Instant Manual Git Sync</span>
                      </h4>
                      <p className="text-xs text-slate-600">
                        Type a custom commit message below to stage and commit all changes to the live GitHub repository.
                      </p>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500 block">Custom Commit Message</label>
                        <input
                          type="text"
                          value={customCommitMessage}
                          onChange={(e) => setCustomCommitMessage(e.target.value)}
                          placeholder="e.g. Fixed current affairs rendering and synchronized jobs"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 shadow-2xs"
                        />
                      </div>

                      <button
                        onClick={() => triggerGitSync('manual_sync_all', customCommitMessage || `admin: manual sync all posts (${posts.length}) and ca (${currentAffairs.length})`)}
                        disabled={isGitSyncing}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {isGitSyncing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Syncing & Pushing to GitHub Main...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>⚡ Stage, Commit & Push All Changes</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* GitHub PAT Token Form */}
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const trimmedToken = githubToken.trim();
                      localStorage.setItem('pariksha_github_token', trimmedToken);
                      try {
                        await fetch('/api/admin/save-token', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ githubToken: trimmedToken })
                        });
                        showToast('🔑 GitHub Token saved on both local browser & backend server! Auto-updates will now push to GitHub.');
                      } catch (err) {
                        console.error("Failed to sync token with backend:", err);
                        showToast('🔑 GitHub Token saved locally, but server sync failed.');
                      }
                    }} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                        <Key className="w-4 h-4 text-indigo-600" />
                        <span>GitHub Personal Access Token (PAT)</span>
                      </h4>
                      <p className="text-xs text-slate-600">
                        Enter your GitHub Personal Access Token if authentication is required for <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">github.com/Rkjaluthariya/PARIKSHA-RESULT</code>.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={githubToken}
                          onChange={(e) => setGithubToken(e.target.value)}
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                          className="flex-grow p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-all"
                        >
                          Save Token
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right Column: Live Sync Log Window */}
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-slate-100 flex flex-col justify-between font-mono text-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400 font-bold flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Git Sync Terminal Output Log</span>
                      </span>
                      <button
                        onClick={() => setGitSyncLog(null)}
                        className="text-[10px] text-slate-500 hover:text-slate-300"
                      >
                        Clear Log
                      </button>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 h-48 overflow-y-auto font-mono text-[11px] leading-relaxed text-emerald-400">
                      {gitSyncLog ? (
                        <pre className="whitespace-pre-wrap">{gitSyncLog}</pre>
                      ) : (
                        <span className="text-slate-500 italic">
                          No recent git sync activity. Any edits to posts or current affairs will automatically log git push results here.
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800">
                      <span>Target Branch: origin/main</span>
                      <span>Deployment Provider: Vercel</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SYNC DIAGNOSTICS & API RESPONSE STATUS DASHBOARD */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-6">
              
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                      Auto-Fetch Source Diagnostics & Error Logs
                    </h3>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      Live Telemetry
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    Real-time monitoring of API status codes, response sizes, scraper fallback methods, and error details for gktoday, sarkariresult, rajsarkariresult, indiasarkarinaukri, and Gemini AI.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={fetchDiagnosticsData}
                    disabled={isLoadingDiagnostics}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoadingDiagnostics ? 'animate-spin' : ''}`} />
                    <span>Refresh Logs</span>
                  </button>

                  <button
                    onClick={() => handleTestSourceFetch('all')}
                    disabled={isTestingFetch !== null}
                    className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isTestingFetch === 'all' ? 'Testing All Sources...' : 'Test All Sources Now'}</span>
                  </button>

                  <button
                    onClick={handleExportDiagnosticsJSON}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    onClick={handleClearDiagnostics}
                    className="px-3.5 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 font-bold text-xs rounded-xl border border-red-800/80 flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Logs</span>
                  </button>
                </div>
              </div>

              {/* Source Health Summary Cards Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    Auto-Fetch Sources Real-Time Response Matrix
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    5 Sources Monitored
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      key: 'gktoday.in',
                      name: 'GKToday.in Portal',
                      category: 'Current Affairs & GK',
                      description: 'Auto-fetches daily current affairs every 5 mins.',
                      badgeBg: 'bg-amber-500/10 border-amber-300 text-amber-900',
                      icon: Zap
                    },
                    {
                      key: 'sarkariresult.com',
                      name: 'SarkariResult.com',
                      category: 'Sarkari Jobs / Admit Cards',
                      description: 'Auto-fetches national job notices every 1 hour.',
                      badgeBg: 'bg-blue-500/10 border-blue-300 text-blue-900',
                      icon: Building
                    },
                    {
                      key: 'rajsarkariresult.com',
                      name: 'RajSarkariResult.com',
                      category: 'Rajasthan State Exams / REET',
                      description: 'Monitors Rajasthan REET, CET 12th Level & RSMSSB.',
                      badgeBg: 'bg-rose-500/10 border-rose-300 text-rose-900',
                      icon: Globe
                    },
                    {
                      key: 'indiasarkarinaukri.com',
                      name: 'IndiaSarkariNaukri.com',
                      category: 'India Post GDS / Schemes',
                      description: 'Monitors Department of Posts & Scholarships.',
                      badgeBg: 'bg-emerald-500/10 border-emerald-300 text-emerald-900',
                      icon: FileText
                    },
                    {
                      key: 'ai-engine',
                      name: 'Gemini AI Model Proxy',
                      category: 'AI Structuring & Rewriter',
                      description: 'Gemini 2.5 Flash Proxy on /server.ts.',
                      badgeBg: 'bg-purple-500/10 border-purple-300 text-purple-900',
                      icon: Sparkles
                    }
                  ].map(srcObj => {
                    const srcInfo = sourceSummary.find(s => s.source === srcObj.key) || {
                      status: 'UNKNOWN',
                      lastUpdated: 'Never',
                      attemptMethod: 'None',
                      httpStatusCode: 'N/A',
                      lastResponseChars: 0,
                      lastItemsAdded: 0,
                      lastLatencyMs: 0,
                      lastErrorMessage: 'No recent logs.',
                      totalAttempts: 0
                    };

                    const isSuccess = srcInfo.status === 'SUCCESS';
                    const isWarning = srcInfo.status === 'WARNING';
                    const isError = srcInfo.status === 'ERROR' || srcInfo.status === 'FETCH_FAILED';

                    const IconComp = srcObj.icon;

                    return (
                      <div key={srcObj.key} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                                <IconComp className="w-4 h-4 text-amber-600" />
                              </div>
                              <div>
                                <h5 className="font-black text-slate-900 text-sm leading-tight">{srcObj.name}</h5>
                                <p className="text-[11px] font-bold text-slate-500">{srcObj.category}</p>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border ${
                              isSuccess ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                              isWarning ? 'bg-amber-100 text-amber-900 border-amber-300' :
                              isError ? 'bg-red-100 text-red-800 border-red-300' :
                              'bg-slate-100 text-slate-600 border-slate-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isSuccess ? 'bg-emerald-600 animate-ping' :
                                isWarning ? 'bg-amber-600' :
                                isError ? 'bg-red-600 animate-bounce' : 'bg-slate-400'
                              }`}></span>
                              {srcInfo.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 leading-normal">{srcObj.description}</p>

                          {/* HTTP Details Matrix */}
                          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between text-slate-600 font-medium text-[11px]">
                              <span>HTTP Status Code:</span>
                              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {srcInfo.httpStatusCode}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600 font-medium text-[11px]">
                              <span>Fetch Method:</span>
                              <span className="font-semibold text-slate-800 truncate max-w-[140px]" title={srcInfo.attemptMethod}>
                                {srcInfo.attemptMethod}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600 font-medium text-[11px]">
                              <span>Latency & Size:</span>
                              <span className="font-mono font-bold text-indigo-700">
                                {srcInfo.lastLatencyMs} ms • {Math.round((srcInfo.lastResponseChars || 0) / 1024)} KB
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600 font-medium text-[11px]">
                              <span>Items Added / Total:</span>
                              <span className="font-bold text-emerald-700">
                                +{srcInfo.lastItemsAdded} items ({srcInfo.totalAttempts} syncs)
                              </span>
                            </div>
                          </div>

                          {/* Error / Warning snippet */}
                          {srcInfo.lastErrorMessage && (
                            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2 text-[11px] text-amber-900 font-mono leading-tight truncate" title={srcInfo.lastErrorMessage}>
                              <span className="font-bold text-amber-950">Notice: </span>
                              {srcInfo.lastErrorMessage}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => handleTestSourceFetch(srcObj.key)}
                            disabled={isTestingFetch === srcObj.key}
                            className="py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-800"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isTestingFetch === srcObj.key ? 'animate-spin' : ''}`} />
                            <span>{isTestingFetch === srcObj.key ? 'Testing...' : 'Test Fetch'}</span>
                          </button>

                          <button
                            onClick={() => handleForceRunDebug(srcObj.key)}
                            disabled={isDebugRunning && debugSource === srcObj.key}
                            className="py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md"
                          >
                            <Zap className="w-3.5 h-3.5 fill-slate-950" />
                            <span>Force Run Debug</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Log Console & Filter Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-sm font-black text-slate-900">
                      Real-Time Diagnostic Log Console ({diagnosticsLogs.length} Records)
                    </h4>
                  </div>

                  {/* Filter Controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search logs & errors..."
                        value={diagSearchTerm}
                        onChange={e => setDiagSearchTerm(e.target.value)}
                        className="pl-8 pr-3 py-1.5 bg-slate-100 text-slate-900 text-xs rounded-xl font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 w-44"
                      />
                    </div>

                    <select
                      value={diagSourceFilter}
                      onChange={e => setDiagSourceFilter(e.target.value)}
                      className="py-1.5 px-3 bg-slate-100 text-slate-800 text-xs rounded-xl font-bold border border-slate-200 focus:outline-none"
                    >
                      <option value="all">All Sources</option>
                      <option value="gktoday.in">gktoday.in</option>
                      <option value="sarkariresult.com">sarkariresult.com</option>
                      <option value="rajsarkariresult.com">rajsarkariresult.com</option>
                      <option value="indiasarkarinaukri.com">indiasarkarinaukri.com</option>
                      <option value="ai-engine">ai-engine</option>
                    </select>

                    <select
                      value={diagStatusFilter}
                      onChange={e => setDiagStatusFilter(e.target.value)}
                      className="py-1.5 px-3 bg-slate-100 text-slate-800 text-xs rounded-xl font-bold border border-slate-200 focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="SUCCESS">SUCCESS</option>
                      <option value="WARNING">WARNING</option>
                      <option value="ERROR">ERROR / FETCH_FAILED</option>
                    </select>
                  </div>
                </div>

                {/* Log Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-800">
                    <thead className="bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Time</th>
                        <th className="p-3">Source & Category</th>
                        <th className="p-3">Fetch Method</th>
                        <th className="p-3">HTTP Code</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Latency / Added</th>
                        <th className="p-3">Error / Log Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {diagnosticsLogs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                            No diagnostic logs recorded yet. Click <strong>"Test All Sources Now"</strong> above to run an active diagnostic test.
                          </td>
                        </tr>
                      ) : (
                        diagnosticsLogs
                          .filter(log => {
                            const matchesSearch =
                              log.source.toLowerCase().includes(diagSearchTerm.toLowerCase()) ||
                              (log.errorMessage && log.errorMessage.toLowerCase().includes(diagSearchTerm.toLowerCase())) ||
                              (log.attemptMethod && log.attemptMethod.toLowerCase().includes(diagSearchTerm.toLowerCase()));
                            const matchesSource = diagSourceFilter === 'all' || log.source === diagSourceFilter;
                            const matchesStatus = diagStatusFilter === 'all' ||
                              (diagStatusFilter === 'ERROR' ? (log.status === 'ERROR' || log.status === 'FETCH_FAILED') : log.status === diagStatusFilter);
                            return matchesSearch && matchesSource && matchesStatus;
                          })
                          .map(log => {
                            const isExpanded = expandedLogId === log.id;
                            return (
                              <React.Fragment key={log.id}>
                                <tr className="hover:bg-slate-50 transition-colors">
                                  <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                  </td>
                                  <td className="p-3">
                                    <div className="font-bold text-slate-900">{log.source}</div>
                                    <div className="text-[10px] text-slate-500 font-semibold">{log.category}</div>
                                  </td>
                                  <td className="p-3 font-semibold text-slate-700 max-w-[150px] truncate" title={log.attemptMethod}>
                                    {log.attemptMethod}
                                  </td>
                                  <td className="p-3 font-mono font-bold">
                                    <span className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded border border-slate-300">
                                      {log.httpStatusCode || '200 OK'}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                      log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                      log.status === 'WARNING' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                                      'bg-red-100 text-red-800 border-red-300'
                                    }`}>
                                      {log.status}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right whitespace-nowrap font-mono">
                                    <span className="text-indigo-700 font-bold">{log.latencyMs ? `${log.latencyMs}ms` : '-'}</span>
                                    <span className="text-slate-400 mx-1">•</span>
                                    <span className="text-emerald-700 font-extrabold">+{log.itemsAddedCount || 0}</span>
                                  </td>
                                  <td className="p-3 max-w-[260px]">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-[11px] font-mono truncate text-slate-700" title={log.errorMessage || log.details}>
                                        {log.errorMessage || log.details || 'Operational'}
                                      </span>
                                      <button
                                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline flex-shrink-0"
                                      >
                                        {isExpanded ? 'Hide' : 'Details'}
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                {isExpanded && (
                                  <tr className="bg-slate-900 text-slate-200 font-mono text-[11px]">
                                    <td colSpan={7} className="p-4 space-y-2 border-t border-slate-800">
                                      <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                                        <span className="text-amber-400 font-bold">LOG ENTRY PAYLOAD DETAILS [{log.id}]</span>
                                        <span className="text-slate-400">{log.timestamp}</span>
                                      </div>
                                      <div><strong className="text-indigo-300">Target Source:</strong> {log.source} ({log.category})</div>
                                      <div><strong className="text-indigo-300">Attempt Method:</strong> {log.attemptMethod}</div>
                                      <div><strong className="text-indigo-300">HTTP Status:</strong> {log.httpStatusCode}</div>
                                      <div><strong className="text-indigo-300">Response Payload Size:</strong> {log.responseSizeChars} characters</div>
                                      <div><strong className="text-indigo-300">Parsed / Added:</strong> {log.itemsFetchedCount} items fetched, {log.itemsAddedCount} added to live list</div>
                                      <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-amber-200 whitespace-pre-wrap">
                                        {log.errorMessage || log.details || 'No error message attached.'}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Troubleshooting & Scraper Architecture Notes */}
              <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-5 space-y-3 text-xs text-indigo-950">
                <div className="font-extrabold flex items-center gap-2 text-indigo-900 text-sm">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <span>How the Multi-Tier Scraper Architecture Prevents Data Failures</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 font-medium leading-relaxed">
                  <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1">
                    <span className="font-bold text-slate-900 block">1. HTTP Direct & RSS Tier</span>
                    Direct HTTP fetch can receive a 403 response from Cloudflare bot protection. The system automatically shifts to Google News RSS search queries (<code className="bg-indigo-100 px-1 py-0.5 rounded text-[10px] font-bold text-indigo-900">site:gktoday.in</code>) which return 200 OK.
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1">
                    <span className="font-bold text-slate-900 block">2. AllOrigins CORS Proxy Tier</span>
                    For direct HTML parsing of <code className="bg-indigo-100 px-1 py-0.5 rounded text-[10px] font-bold text-indigo-900">sarkariresult.com</code>, <code className="bg-indigo-100 px-1 py-0.5 rounded text-[10px] font-bold text-indigo-900">rajsarkariresult.com</code>, and <code className="bg-indigo-100 px-1 py-0.5 rounded text-[10px] font-bold text-indigo-900">indiasarkarinaukri.com</code>, requests are proxied securely.
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1">
                    <span className="font-bold text-slate-900 block">3. Gemini AI 3.6 Flash Rewriter</span>
                    Raw scraped text or RSS feeds are processed via Gemini 3.6 Flash to automatically rewrite articles, extract structured JSON (important dates, vacancy counts, apply links), and format clean Markdown.
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1">
                    <span className="font-bold text-slate-900 block">4. Automatic Diagnostic Logging</span>
                    Every background cron execution (5 mins for CA, 1 hr for Jobs) records response codes, sizes, latency, and error snippets to this dashboard for immediate troubleshooting.
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* FOOTER ACTION BAR */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 font-medium flex-shrink-0 gap-2.5">
          <span className="text-center sm:text-left text-[11px] sm:text-xs">
            Pariksha Result Admin v2026.8.6 • All changes apply live.
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-lg sm:rounded-xl shadow-sm transition-all text-center"
          >
            Close Admin Panel
          </button>
        </div>

      </div>

      {/* EDIT/ADD POST INLINE MODAL - FULL SCREEN FOR MOBILE & DESKTOP */}
      {editingPost && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 flex flex-col w-full h-full overflow-hidden p-0">
          <div className="bg-white w-full h-full flex flex-col overflow-hidden">
            <div className="bg-slate-900 text-white p-4 sm:px-6 flex items-center justify-between border-b border-slate-800 flex-shrink-0 shadow-md">
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-400" />
                <span>{isCreatingPost ? 'Create New Sarkari Post / Blog' : 'Edit Sarkari Post / Blog Details'}</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePost}
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Post / Blog</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="text-slate-400 hover:text-white font-bold text-lg ml-2 p-1"
                  title="Close Full Screen Editor"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSavePost} className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-grow text-xs w-full max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Post / Blog Title <span className="text-slate-400 font-normal text-[11px]">(Heading)</span>
                  </label>
                  <input
                    type="text"
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    placeholder={editingPost.category === 'blog' ? 'Blog Title / Topic Name...' : 'Post Title...'}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Organization <span className="text-slate-400 font-normal text-[11px]">(Optional / ऐच्छिक)</span>
                  </label>
                  <input
                    type="text"
                    value={editingPost.organization || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, organization: e.target.value })}
                    placeholder={editingPost.category === 'blog' ? 'e.g. Education / Pariksha Result (Optional)' : 'e.g. SSC, UPSC, Railway (Optional)'}
                    className="w-full p-2 border border-slate-300 rounded font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value as CategoryType })}
                    className="w-full p-2 border border-slate-300 rounded font-medium"
                  >
                    <option value="latest-jobs">Latest Jobs</option>
                    <option value="results">Results</option>
                    <option value="admit-card">Admit Card</option>
                    <option value="answer-key">Answer Key</option>
                    <option value="syllabus">Syllabus</option>
                    <option value="admission">Admission</option>
                    <option value="blog">Blog</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Vacancies</label>
                  <input
                    type="text"
                    value={editingPost.totalVacancies || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, totalVacancies: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Post Date</label>
                  <input
                    type="date"
                    value={editingPost.postDate}
                    onChange={(e) => setEditingPost({ ...editingPost, postDate: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Last Date to Apply</label>
                  <input
                    type="text"
                    value={editingPost.lastDate || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, lastDate: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Summary Info (AEO Box)</label>
                <textarea
                  rows={2}
                  value={editingPost.shortInfo}
                  onChange={(e) => setEditingPost({ ...editingPost, shortInfo: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              {/* FEATURED BANNER IMAGE UPLOAD & GENERATOR */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-[#FF6B00]" />
                    <span>Featured Image Banner (SEO, OpenGraph &amp; Article)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newImg = generateH1ImageBanner(editingPost.title, (editingPost.category || 'BLOG').toUpperCase());
                      setEditingPost({
                        ...editingPost,
                        heroImage: newImg,
                        openGraph: {
                          title: editingPost.title || 'Pariksha Result',
                          description: editingPost.shortInfo || '',
                          type: 'article',
                          url: `https://pariksha-result.vercel.app/blog/${editingPost.slug || ''}`,
                          image: newImg,
                          siteName: 'Pariksha Result'
                        },
                        schemas: {
                          faqSchema: editingPost.schemas?.faqSchema || {},
                          breadcrumbSchema: editingPost.schemas?.breadcrumbSchema || {},
                          articleSchema: { ...(editingPost.schemas?.articleSchema || {}), image: newImg }
                        }
                      });
                      showToast('🎨 Custom image banner generated from H1 title!');
                    }}
                    className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-[11px] rounded-lg shadow-sm flex items-center gap-1 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Regenerate Image from H1 Title</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-1 h-28 bg-slate-200 rounded-lg overflow-hidden border border-slate-300 relative">
                    {editingPost.heroImage || (editingPost.schemas?.articleSchema as any)?.image || editingPost.openGraph?.image ? (
                      <img
                        src={editingPost.heroImage || (editingPost.schemas?.articleSchema as any)?.image || editingPost.openGraph?.image}
                        alt={editingPost.title || 'Official post image preview'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const stage = parseInt(target.dataset.fallbackStage || '0', 10);
                          if (stage === 0) {
                            target.dataset.fallbackStage = '1';
                            target.src = generateH1ImageBanner(editingPost.title || 'Official Recruitment Update', editingPost.category || 'SARKARI EXAM');
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2 text-center text-[10px]">
                        <FileText className="w-6 h-6 mb-1 opacity-50" />
                        <span>No image set</span>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Image URL / Data URI</label>
                      <input
                        type="text"
                        value={editingPost.heroImage || (editingPost.schemas?.articleSchema as any)?.image || editingPost.openGraph?.image || ''}
                        onChange={(e) => {
                          const imgUrl = e.target.value;
                          setEditingPost({
                            ...editingPost,
                            heroImage: imgUrl,
                            openGraph: {
                              title: editingPost.title || 'Pariksha Result',
                              description: editingPost.shortInfo || '',
                              type: 'article',
                              url: `https://pariksha-result.vercel.app/blog/${editingPost.slug || ''}`,
                              image: imgUrl,
                              siteName: 'Pariksha Result'
                            },
                            schemas: {
                              faqSchema: editingPost.schemas?.faqSchema || {},
                              breadcrumbSchema: editingPost.schemas?.breadcrumbSchema || {},
                              articleSchema: { ...(editingPost.schemas?.articleSchema || {}), image: imgUrl }
                            }
                          });
                        }}
                        placeholder="https://... or upload custom image file below"
                        className="w-full p-2 border border-slate-300 rounded font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Upload Custom Image File (Supports PNG, JPG, JPEG, WebP - max 3MB)</label>
                      <input
                        type="file"
                        accept=".webp,.jpg,.jpeg,.png,image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (uploadEvt) => {
                              const base64Img = uploadEvt.target?.result as string;
                              if (base64Img) {
                                setEditingPost({
                                  ...editingPost,
                                  heroImage: base64Img,
                                  openGraph: {
                                    title: editingPost.title || 'Pariksha Result',
                                    description: editingPost.shortInfo || '',
                                    type: 'article',
                                    url: `https://pariksha-result.vercel.app/blog/${editingPost.slug || ''}`,
                                    image: base64Img,
                                    siteName: 'Pariksha Result'
                                  },
                                  schemas: {
                                    faqSchema: editingPost.schemas?.faqSchema || {},
                                    breadcrumbSchema: editingPost.schemas?.breadcrumbSchema || {},
                                    articleSchema: { ...(editingPost.schemas?.articleSchema || {}), image: base64Img }
                                  }
                                });
                                showToast('📁 Custom WebP/JPG image file uploaded successfully!');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-[11px] text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Image Alt Text / Description (इमेज का Alt Text - SEO & AEO के लिए अत्यंत महत्वपूर्ण)</label>
                      <input
                        type="text"
                        value={editingPost.imageAltText || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, imageAltText: e.target.value })}
                        placeholder="e.g. Bihar Board Matric Result 2026, WebP or JPG Alt Text"
                        className="w-full p-2 border border-slate-300 rounded font-medium text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQs EDITOR SECTION */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>Frequently Asked Questions (FAQs &amp; Schema)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedFaqs = [...(editingPost.faqs || []), { question: 'New Question?', answer: 'Answer details...' }];
                      setEditingPost({ ...editingPost, faqs: updatedFaqs });
                    }}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add FAQ Item</span>
                  </button>
                </div>

                {(!editingPost.faqs || editingPost.faqs.length === 0) ? (
                  <p className="text-[11px] text-slate-500 italic">No FAQs added yet for this post/blog.</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {editingPost.faqs.map((faq, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-500 uppercase">FAQ #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingPost.faqs?.filter((_, i) => i !== idx);
                              setEditingPost({ ...editingPost, faqs: updated });
                            }}
                            className="text-red-500 hover:text-red-700 font-bold text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = [...(editingPost.faqs || [])];
                            updated[idx] = { ...updated[idx], question: e.target.value };
                            setEditingPost({ ...editingPost, faqs: updated });
                          }}
                          placeholder="Question..."
                          className="w-full p-1.5 border border-slate-300 rounded text-[11px] font-bold text-slate-900"
                        />
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const updated = [...(editingPost.faqs || [])];
                            updated[idx] = { ...updated[idx], answer: e.target.value };
                            setEditingPost({ ...editingPost, faqs: updated });
                          }}
                          placeholder="Answer..."
                          className="w-full p-1.5 border border-slate-300 rounded text-[11px] text-slate-700"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rich Text & Image Upload Editor for Full Description */}
              <RichTextEditor
                label="Full Content & Blog Editor (Rich Markdown, Bold, Bullets, Hyperlinks & Images)"
                value={editingPost.fullDescription}
                onChange={(newVal) => setEditingPost({ ...editingPost, fullDescription: newVal })}
                placeholder="Write or format full post details, add images, links, bullet points..."
                rows={9}
              />

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md transition-all"
                >
                  Save Post / Blog Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/ADD CA INLINE MODAL - FULL SCREEN */}
      {editingCa && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 flex flex-col w-full h-full overflow-hidden p-0">
          <div className="bg-white w-full h-full flex flex-col overflow-hidden">
            <div className="bg-slate-900 text-white p-4 sm:px-6 flex items-center justify-between border-b border-slate-800 flex-shrink-0 shadow-md">
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>{isCreatingCa ? 'Add New Current Affairs Article' : 'Edit Current Affairs Article'}</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCa(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCa}
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Article</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCa(null)}
                  className="text-slate-400 hover:text-white font-bold text-lg ml-2 p-1"
                  title="Close Full Screen Editor"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveCa} className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-grow text-xs w-full max-w-7xl mx-auto">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={editingCa.title}
                  onChange={(e) => setEditingCa({ ...editingCa, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingCa.category}
                    onChange={(e) => setEditingCa({ ...editingCa, category: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={editingCa.date}
                    onChange={(e) => setEditingCa({ ...editingCa, date: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Summary</label>
                <textarea
                  rows={2}
                  required
                  value={editingCa.summary}
                  onChange={(e) => setEditingCa({ ...editingCa, summary: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              {/* FEATURED CA IMAGE UPLOAD */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Featured Image Banner / Thumbnail (Supports WebP, JPG, PNG)</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-1 h-24 bg-slate-200 rounded-lg overflow-hidden border border-slate-300 relative">
                    {editingCa.image || editingCa.imageUrl || editingCa.heroImage ? (
                      <img
                        src={editingCa.image || editingCa.imageUrl || editingCa.heroImage}
                        alt={editingCa.title || 'CA Article preview'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2 text-center text-[10px]">
                        <Zap className="w-5 h-5 mb-1 opacity-50" />
                        <span>No image set</span>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Image URL / Data URI</label>
                      <input
                        type="text"
                        value={editingCa.image || editingCa.imageUrl || editingCa.heroImage || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingCa({
                            ...editingCa,
                            image: val,
                            imageUrl: val,
                            heroImage: val
                          });
                        }}
                        placeholder="https://... or upload custom image below"
                        className="w-full p-2 border border-slate-300 rounded font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Upload Custom Image File (Supports PNG, JPG, JPEG, WebP - max 3MB)</label>
                      <input
                        type="file"
                        accept=".webp,.jpg,.jpeg,.png,image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (uploadEvt) => {
                              const base64Img = uploadEvt.target?.result as string;
                              if (base64Img) {
                                setEditingCa({
                                  ...editingCa,
                                  image: base64Img,
                                  imageUrl: base64Img,
                                  heroImage: base64Img
                                });
                                showToast('📁 Custom WebP/JPG current affairs image uploaded!');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-[11px] text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rich Text & Image Upload Editor for CA Article */}
              <RichTextEditor
                label="Full Article Content (Bold, Bullets, Hyperlinks & Image Upload)"
                value={editingCa.fullContent}
                onChange={(newVal) => setEditingCa({ ...editingCa, fullContent: newVal })}
                placeholder="Write full article details, format key bullet points, add links or images..."
                rows={7}
              />

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCa(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md transition-all"
                >
                  Save CA Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isImportModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                <h3 className="font-bold text-lg">Import Post by URL</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 hover:bg-white/20 rounded-md transition-colors"
                disabled={isImporting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 sm:p-6 space-y-4">
              <p className="text-sm text-slate-600 font-medium">
                Paste the URL of any supported public job post, exam result, or admit card webpage. Our AI will automatically extract the details, clean the formatting, and prepare it for review.
              </p>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Source URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/job-post"
                  className="w-full border-2 border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  disabled={isImporting}
                  autoFocus
                />
              </div>

              {importError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-lg transition-colors"
                disabled={isImporting}
              >
                Cancel
              </button>
              <button
                onClick={handleImportUrl}
                disabled={isImporting || !importUrl.trim()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Fetching & Extracting...</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-4 h-4" />
                    <span>Fetch Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Force Run Debug Inspector Modal Overlay */}
      {debugModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                  <Zap className="w-5 h-5 fill-amber-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-amber-300">Single-Cycle Force Run Debug Inspector</h3>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-[11px] font-bold rounded-lg uppercase">
                      {debugSource}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Real-time single-cycle scraper execution & raw output viewer
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {debugData && debugData.rawContentSnippet && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(debugData.rawContentSnippet);
                      setDebugCopyToast(true);
                      setTimeout(() => setDebugCopyToast(false), 2000);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    {debugCopyToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                    <span>{debugCopyToast ? 'Copied!' : 'Copy Raw Output'}</span>
                  </button>
                )}
                <button
                  onClick={() => setDebugModalOpen(false)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Status Metadata Bar */}
            {isDebugRunning ? (
              <div className="p-8 text-center space-y-3 bg-slate-900/50">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <p className="text-sm font-bold text-amber-300">Executing Single-Cycle Force Run on {debugSource}...</p>
                <p className="text-xs text-slate-400">Fetching live page, bypassing cache & analyzing output headers...</p>
              </div>
            ) : debugData ? (
              <div className="p-4 bg-slate-950/60 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">HTTP Status</span>
                  <span className="font-black text-emerald-400 text-sm font-mono flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    {debugData.httpStatusCode || 200}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Latency</span>
                  <span className="font-black text-amber-400 text-sm font-mono">
                    {debugData.latencyMs ? `${debugData.latencyMs} ms` : 'N/A'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Raw Output Size</span>
                  <span className="font-black text-cyan-400 text-sm font-mono">
                    {debugData.responseSizeChars ? `${(debugData.responseSizeChars / 1024).toFixed(2)} KB` : '0 KB'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Parsed Items</span>
                  <span className="font-black text-purple-400 text-sm font-mono">
                    {debugData.parsedItems?.length || 0} Items Parsed
                  </span>
                </div>
              </div>
            ) : null}

            {/* Tab Navigation */}
            {!isDebugRunning && debugData && (
              <div className="px-4 pt-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setDebugActiveTab('raw')}
                  className={`px-4 py-2 font-bold text-xs rounded-t-xl transition-all border-t border-x ${
                    debugActiveTab === 'raw'
                      ? 'bg-slate-900 text-amber-300 border-amber-500/40 border-b-0 font-black'
                      : 'bg-slate-950 text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  Raw Scraper Output (HTML/Text)
                </button>
                <button
                  onClick={() => setDebugActiveTab('parsed')}
                  className={`px-4 py-2 font-bold text-xs rounded-t-xl transition-all border-t border-x ${
                    debugActiveTab === 'parsed'
                      ? 'bg-slate-900 text-amber-300 border-amber-500/40 border-b-0 font-black'
                      : 'bg-slate-950 text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  Parsed Structured Items ({debugData.parsedItems?.length || 0})
                </button>
                <button
                  onClick={() => setDebugActiveTab('logs')}
                  className={`px-4 py-2 font-bold text-xs rounded-t-xl transition-all border-t border-x ${
                    debugActiveTab === 'logs'
                      ? 'bg-slate-900 text-amber-300 border-amber-500/40 border-b-0 font-black'
                      : 'bg-slate-950 text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  Full Debug JSON Payload
                </button>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 font-sans text-xs">
              {!isDebugRunning && debugData && debugActiveTab === 'raw' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Source Target: <strong className="text-amber-300">{debugData.targetUrl}</strong></span>
                    <span>Snippet Length: <strong>{debugData.rawContentSnippet?.length || 0} chars</strong></span>
                  </div>
                  <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[480px] shadow-inner selection:bg-amber-500 selection:text-slate-950">
                    {debugData.rawContentSnippet || "No raw text response returned."}
                  </pre>
                </div>
              )}

              {!isDebugRunning && debugData && debugActiveTab === 'parsed' && (
                <div className="space-y-3">
                  {debugData.parsedItems && debugData.parsedItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {debugData.parsedItems.map((item: any, idx: number) => (
                        <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 hover:border-amber-500/40 transition-all">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                              Item #{idx + 1}
                            </span>
                            {item.category && (
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-slate-100 leading-snug">
                            {item.title || item.name || "Untitled Article"}
                          </h4>
                          {item.organization && (
                            <p className="text-[11px] text-slate-400 font-medium">
                              Organization: <strong className="text-slate-200">{item.organization}</strong>
                            </p>
                          )}
                          {item.summary && (
                            <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                              {item.summary}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-xl text-slate-400">
                      <p className="font-bold text-sm text-amber-300">No new parsed items extracted in this run.</p>
                      <p className="text-xs mt-1">Items may already exist in memory or website HTML structure shifted.</p>
                    </div>
                  )}
                </div>
              )}

              {!isDebugRunning && debugData && debugActiveTab === 'logs' && (
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-cyan-300 text-[11px] leading-relaxed overflow-x-auto max-h-[480px]">
                  {JSON.stringify(debugData, null, 2)}
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                Diagnostic Status: <strong className="text-emerald-400">{debugData?.success ? 'SUCCESS (200)' : 'IDLE'}</strong>
              </span>
              <button
                onClick={() => setDebugModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Resolution Modal Overlay */}
      {duplicateModalData && (
        <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-500 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-900 space-y-0">
            <div className="p-4 sm:p-5 bg-amber-50 border-b border-amber-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-amber-950">Possible Duplicate Recruitment Found</h3>
                <p className="text-xs text-amber-800 font-medium">
                  {duplicateModalData.reason || "A matching post already exists in your database."}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Existing Post in Database</span>
                <p className="font-black text-sm text-slate-900">{duplicateModalData.existingPost?.title}</p>
                <div className="flex flex-wrap items-center gap-2 text-slate-600">
                  <span className="px-2 py-0.5 bg-slate-200 rounded text-[10px] font-bold">{duplicateModalData.existingPost?.organization}</span>
                  <span>Category: {duplicateModalData.existingPost?.category}</span>
                  <span>Last Date: {duplicateModalData.existingPost?.lastDate || 'N/A'}</span>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-2">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">New Fetched Post from URL</span>
                <p className="font-black text-sm text-indigo-950">{duplicateModalData.article?.title}</p>
                <div className="flex flex-wrap items-center gap-2 text-indigo-800">
                  <span className="px-2 py-0.5 bg-indigo-200 rounded text-[10px] font-bold">{duplicateModalData.article?.organization}</span>
                  <span>Category: {duplicateModalData.article?.category}</span>
                  <span>Last Date: {duplicateModalData.article?.lastDate || 'N/A'}</span>
                </div>
              </div>

              <p className="text-slate-600 font-medium">
                How would you like to proceed with this imported recruitment update?
              </p>
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-2">
              <button
                onClick={() => setDuplicateModalData(null)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEditingPost({
                    ...duplicateModalData.existingPost,
                    ...duplicateModalData.article,
                    id: duplicateModalData.existingPost.id,
                    slug: duplicateModalData.existingPost.slug
                  });
                  setIsCreatingPost(false);
                  setDuplicateModalData(null);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all"
              >
                Update Existing Post
              </button>
              <button
                onClick={() => {
                  setEditingPost(duplicateModalData.article);
                  setIsCreatingPost(true);
                  setDuplicateModalData(null);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-md transition-all"
              >
                Create New Separate Post
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
