import type { Request, Response } from 'express'
import { YouTubeService } from '../services/youtubeService'
import type { ApiResponse, DescriptionResponse } from '../types/youtube'

export class YouTubeController {
  static async getTranscript(req: Request, res: Response): Promise<void> {
    const { url } = req.query

    if (!url || typeof url !== 'string') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Missing or invalid URL parameter',
      }
      res.status(400).json(errorResponse)
      return
    }

    try {
      const data = await YouTubeService.getTranscript(url)

      const successResponse: ApiResponse<any> = {
        success: true,
        data,
      }

      res.json(successResponse)
    } catch (error) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch transcript',
        details: error instanceof Error ? error.message : 'Unknown error',
      }
      res.status(500).json(errorResponse)
    }
  }

  static async getDescription(req: Request, res: Response): Promise<void> {
    const { url } = req.query

    if (!url || typeof url !== 'string') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Missing or invalid URL parameter',
      }
      res.status(400).json(errorResponse)
      return
    }

    try {
      const data = await YouTubeService.getDescription(url)
      const successResponse: ApiResponse<DescriptionResponse> = {
        success: true,
        data,
      }
      res.json(successResponse)
    } catch (error) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch description',
        details: error instanceof Error ? error.message : 'Unknown error',
      }
      res.status(500).json(errorResponse)
    }
  }

  static async getVideoInfo(req: Request, res: Response): Promise<void> {
    const { url } = req.query

    if (!url || typeof url !== 'string') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Missing or invalid URL parameter',
      }
      res.status(400).json(errorResponse)
      return
    }

    try {
      console.log('________url', url)
      const data = await YouTubeService.getVideoInfo(url)
      const successResponse: ApiResponse<typeof data> = {
        success: true,
        data,
      }
      res.json(successResponse)
    } catch (error) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch video info',
        details: error instanceof Error ? error.message : 'Unknown error',
      }
      res.status(500).json(errorResponse)
    }
  }

  static async getCaptionsList(req: Request, res: Response): Promise<void> {
    const { url } = req.query

    if (!url || typeof url !== 'string') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Missing or invalid URL parameter',
      }
      res.status(400).json(errorResponse)
      return
    }

    try {
      const data = await YouTubeService.getCaptionsList(url)
      const successResponse: ApiResponse<typeof data> = {
        success: true,
        data,
      }
      res.json(successResponse)
    } catch (error) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch captions list',
        details: error instanceof Error ? error.message : 'Unknown error',
      }
      res.status(500).json(errorResponse)
    }
  }

  static async takeScreenshot(req: Request, res: Response): Promise<void> {
    const { url } = req.query

    if (!url || typeof url !== 'string') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Missing or invalid URL parameter',
      }
      res.status(400).json(errorResponse)
      return
    }

    try {
      const data = await YouTubeService.takeScreenshot(url)
      const successResponse: ApiResponse<typeof data> = {
        success: true,
        data,
      }
      res.json(successResponse)
    } catch (error) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Failed to take screenshot',
      }
    }
  }
}
