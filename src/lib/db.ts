import { PrismaClient } from '@prisma/client'
import { copyFileSync, existsSync } from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Menentukan lokasi file SQLite secara deterministik (absolut, relatif terhadap
 * root project) supaya tidak tergantung pada cara resolusi path Prisma di tiap
 * environment (dev server, build, maupun serverless).
 *
 * Di Vercel (serverless), filesystem hanya bisa dibaca — satu-satunya folder
 * yang writable adalah /tmp. Database bawaan yang ikut ter-deploy disalin ke
 * /tmp pada cold start sehingga fitur RSVP tetap bisa menulis (bersifat
 * sementara per instance serverless).
 */
function resolveDatasourceUrl(): string {
  const bundledDb = path.join(process.cwd(), 'db', 'custom.db')

  if (process.env.VERCEL === '1' && process.env.NODE_ENV === 'production') {
    try {
      if (existsSync(bundledDb)) {
        copyFileSync(bundledDb, '/tmp/vintage-peacock.db')
        return 'file:/tmp/vintage-peacock.db'
      }
    } catch {
      // Gagal menyalin — lanjut pakai path bawaan (read-only, GET tetap jalan)
    }
  }

  return `file:${bundledDb}`
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
    datasources: {
      db: { url: resolveDatasourceUrl() },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
