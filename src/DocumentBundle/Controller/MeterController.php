<?php

namespace DocumentBundle\Controller;

use DocumentBundle\Entity\MeterDocument;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use CoreBundle\Controller\BaseDocumentController;
use Symfony\Component\HttpFoundation\Response;

class MeterController extends BaseDocumentController
{
    /**
     * @var string
     */
    protected $entity = MeterDocument::class;

    /**
     * @Route("/meter/{id}")
     * @Method("GET")
     * @var int $id
     * @return JsonResponse
     */
    public function getAction($id)
    {
        return parent::getAction($id);
    }

    /**
     * @Route("/list/meter")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function listAction(Request $request)
    {
        return parent::listAction($request);
    }

    /**
     * @Route("/meter/{id}")
     * @Method("DELETE")
     * @var int $id
     * @return JsonResponse
     */
    public function deleteAction($id)
    {
        return parent::deleteAction($id);
    }

    /**
     * @Route("/meter/{id}")
     * @Method("POST")
     * @var Request $request
     * @var int     $id
     * @return JsonResponse
     */
    public function patchAction(Request $request, $id)
    {
        return parent::patchAction($request, $id);
    }

    /**
     * @Route("/meter")
     * @Method("POST")
     * @var Request $request
     * @return JsonResponse
     */
    public function postAction(Request $request)
    {
        return parent::postAction($request);
    }

    /**
     * @Route("/supply/meter")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function supplyAction(Request $request)
    {
        $search = $request->get('search');
        $date = $request->get('date');

        if (!$search || !$date) {
            return $this->sendResponse([], Response::HTTP_OK);
        }

        $date = new \DateTime($date);

        return $this->sendResponse($this->getRepository()->search($search, $date, $this->getUnitId()), Response::HTTP_OK);
    }
}