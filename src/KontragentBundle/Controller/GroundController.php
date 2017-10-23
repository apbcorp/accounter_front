<?php

namespace KontragentBundle\Controller;

use CoreBundle\Controller\BaseEntityController;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Kontragent;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Response;

class GroundController extends BaseEntityController
{
    /**
     * @var string
     */
    protected $entity = Ground::class;

    /**
     * @Route("/ground/{id}")
     * @Method("GET")
     * @var int $id
     * @return JsonResponse
     */
    public function getAction($id)
    {
        return parent::getAction($id);
    }

    /**
     * @Route("/list/ground")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function listAction(Request $request)
    {
        return parent::listAction($request);
    }

    /**
     * @Route("/ground/delete/{id}")
     * @Method("GET")
     * @var int $id
     * @return JsonResponse
     */
    public function deleteAction($id)
    {
        return parent::deleteAction($id);
    }

    /**
     * @Route("/ground/{id}")
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
     * @Route("/ground")
     * @Method("POST")
     * @var Request $request
     * @return JsonResponse
     */
    public function postAction(Request $request)
    {
        return parent::postAction($request);
    }

    /**
     * @Route("/supply/ground")
     * @Method("GET")
     * @param Request $request
     * @return JsonResponse
     */
    public function supplyAction(Request $request)
    {
        return parent::suppplyAction($request);
    }

    /**
     * @Route("/ground_by_kontragent/{id}")
     * @Method("GET")
     * @param Request $request
     * @param int     $id
     * @return JsonResponse
     */
    public function getGroundByKontragentAction(Request $request, $id)
    {
        $kontragentRef = $this->getDoctrine()->getManager()->getReference(Kontragent::class, $id);
        
        return $this->sendResponse($this->getRepository()->findBy(['kontragent' => $kontragentRef]), Response::HTTP_OK);
    }
}