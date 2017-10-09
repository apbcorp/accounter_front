<?php

namespace UserBundle\Controller;

use CoreBundle\Container\CookieContainer;
use CoreBundle\Controller\BaseController;
use CoreBundle\Entity\Users;
use CoreBundle\Service\TokenService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class UserController extends BaseController
{
    const USER_NOT_FOUND = 'User not found';

    /**
     * @Route("/v1.0/user/current")
     * @Method("GET")
     * @return JsonResponse
     */
    public function currentAction()
    {
        /** @var TokenService $tokenService */
        $tokenService = $this->get('auth.service.token');
        $user = $tokenService->getTokenEntity()->getUser();

        return $this->sendResponse(['userId' => $user->getId(), 'unitIds' => $user->getUnits()], Response::HTTP_OK);
    }

    /**
     * @Route("/auth/login")
     * @Method("POST")
     */
    public function LoginAction(Request $request)
    {
        $params = [
            'username' => $request->request->get('login'),
            'password' => md5($request->request->get('password')),
            'active' => true
        ];

        /** @var Users $user */
        $user = $this->getDoctrine()->getManager()->getRepository(Users::class)->findOneBy($params);

        if (!$user) {
            return $this->sendResponse(['message' => self::USER_NOT_FOUND], Response::HTTP_FORBIDDEN);
        }

        /** @var TokenService $tokenService */
        $tokenService = $this->get('auth.service.token');
        $token = $tokenService->generateNewToken($user);

        /** @var CookieContainer $cookieContainer */
        $cookieContainer = $this->get('core.container.cookie');
        $cookieContainer->add('token', $token);

        return $this->sendResponse(['userId' => $user->getId(), 'token' => $token], Response::HTTP_OK);
    }

    /**
     * @Route("/v1.0/logout")
     * @Method("GET")
     */
    public function logoutAction(Request $request)
    {
        /** @var TokenService $tokenService */
        $tokenService = $this->get('auth.service.token');

        if (!$tokenService->destroyCurrentToken()) {
            return $this->sendResponse([], Response::HTTP_UNAUTHORIZED);
        }

        /** @var CookieContainer $cookieContainer */
        $cookieContainer = $this->get('core.container.cookie');
        $cookieContainer->add('token', '');

        return $this->sendResponse([], Response::HTTP_OK);
    }
}
