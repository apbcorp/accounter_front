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
        $search = urldecode($request->get('search'));

        if (!$search) {
            return $this->sendResponse([], Response::HTTP_OK);
        }

        return $this->sendResponse($this->getRepository()->search($search, $this->getUnitId()), Response::HTTP_OK);
    }
}