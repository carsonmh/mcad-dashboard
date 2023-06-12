import { secureRoute } from '../../../utils/route-security';
import { KubeFastifyInstance, OauthFastifyRequest } from '../../../types';
import { FastifyRequest, FastifyReply } from 'fastify';
import { metricsData } from './metricsData';
import { getDirectCallOptions } from '../../../utils/directCallUtils';

module.exports = module.exports = async (fastify: KubeFastifyInstance) => {
  fastify.post(
    '/',
    secureRoute(fastify)(
      async (
        request: OauthFastifyRequest<{
          Body: { query: string; range: number[]; step: number };
        }>,
      ) => {
        const { query, range, step } = request.body;

        try {
          return await metricsData(fastify, request, query, range, step);
        } catch (err) {
          return err;
        }
      },
    ),
  );
};
