<?php

namespace CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class BaseEntityController extends BaseDocumentController
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function suppplyAction(Request $request)
    {
        $search = $request->get('search');

        if (!$search) {
            return $this->sendResponse([], Response::HTTP_OK);
        }

        return $this->sendResponse($this->getRepository()->search($search), Response::HTTP_OK);
    }
}